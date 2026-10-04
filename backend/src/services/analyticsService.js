const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Employment = require('../models/Employment');
const Job = require('../models/Job');
const TrainingProgram = require('../models/TrainingProgram');
const { ROLES, ENROLLMENT_STATUS, EMPLOYMENT_STATUS } = require('../config/constants');

class AnalyticsService {
  /**
   * Get overview statistics for government dashboard
   */
  static async getOverview() {
    const [
      totalStudents,
      totalTrainingCentres,
      totalEmployers,
      totalEnrollments,
      completedEnrollments,
      totalCertificates,
      totalEmployment,
      verifiedEmployment,
      activePrograms,
      activeJobs,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.STUDENT }),
      User.countDocuments({ role: ROLES.TRAINING_CENTRE }),
      User.countDocuments({ role: ROLES.EMPLOYER }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: ENROLLMENT_STATUS.COMPLETED }),
      Certificate.countDocuments(),
      Employment.countDocuments(),
      Employment.countDocuments({
        status: { $in: [EMPLOYMENT_STATUS.EMPLOYER_VERIFIED, EMPLOYMENT_STATUS.GOVERNMENT_VERIFIED] },
      }),
      TrainingProgram.countDocuments({ status: 'Active' }),
      Job.countDocuments({ status: 'Published' }),
    ]);

    const trainingCompletionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    const employmentRate =
      totalStudents > 0
        ? Math.round((totalEmployment / totalStudents) * 100)
        : 0;

    return {
      totalStudents,
      totalTrainingCentres,
      totalEmployers,
      totalEnrollments,
      completedEnrollments,
      trainingCompletionRate,
      totalCertificates,
      totalEmployment,
      verifiedEmployment,
      employmentRate,
      activePrograms,
      activeJobs,
    };
  }

  /**
   * Get district-wise analytics
   */
  static async getDistrictAnalytics() {
    const studentsByDistrict = await User.aggregate([
      { $match: { role: ROLES.STUDENT } },
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const employmentByDistrict = await Employment.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const trainingByDistrict = await TrainingProgram.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return {
      studentsByDistrict,
      employmentByDistrict,
      trainingByDistrict,
    };
  }

  /**
   * Get skill demand vs supply analytics
   */
  static async getSkillAnalytics() {
    // Demand: skills required in published jobs
    const skillDemand = await Job.aggregate([
      { $match: { status: 'Published' } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', demand: { $sum: 1 } } },
      { $sort: { demand: -1 } },
      { $limit: 20 },
    ]);

    // Supply: skills available among students
    const skillSupply = await StudentProfile.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', supply: { $sum: 1 } } },
      { $sort: { supply: -1 } },
      { $limit: 20 },
    ]);

    // Merge demand and supply
    const skillMap = new Map();

    skillDemand.forEach((item) => {
      skillMap.set(item._id, { skill: item._id, demand: item.demand, supply: 0 });
    });

    skillSupply.forEach((item) => {
      if (skillMap.has(item._id)) {
        skillMap.get(item._id).supply = item.supply;
      } else {
        skillMap.set(item._id, { skill: item._id, demand: 0, supply: item.supply });
      }
    });

    const skillAnalytics = Array.from(skillMap.values()).sort(
      (a, b) => b.demand - a.demand
    );

    // Priority gaps: high demand + low supply
    const priorityGaps = skillAnalytics
      .filter((s) => s.demand > s.supply)
      .sort((a, b) => (b.demand - b.supply) - (a.demand - a.supply))
      .slice(0, 10);

    return {
      skillDemand,
      skillSupply,
      skillAnalytics,
      priorityGaps,
    };
  }

  /**
   * Get training effectiveness metrics
   */
  static async getTrainingEffectiveness() {
    const programs = await TrainingProgram.find().populate('centre', 'centreName').lean();

    const effectiveness = await Promise.all(
      programs.map(async (program) => {
        const enrolled = await Enrollment.countDocuments({ program: program._id });
        const completed = await Enrollment.countDocuments({
          program: program._id,
          status: ENROLLMENT_STATUS.COMPLETED,
        });
        const certified = await Certificate.countDocuments({ program: program._id });

        // Find students who completed this program and got employed
        const completedStudents = await Enrollment.find({
          program: program._id,
          status: ENROLLMENT_STATUS.COMPLETED,
        }).select('student');
        const studentIds = completedStudents.map((e) => e.student);

        const employed = await Employment.countDocuments({
          student: { $in: studentIds },
        });
        const verified = await Employment.countDocuments({
          student: { $in: studentIds },
          status: { $in: [EMPLOYMENT_STATUS.EMPLOYER_VERIFIED, EMPLOYMENT_STATUS.GOVERNMENT_VERIFIED] },
        });

        return {
          program: {
            _id: program._id,
            title: program.title,
            centre: program.centre?.centreName || 'N/A',
            district: program.district,
          },
          metrics: {
            enrolled,
            completed,
            certified,
            employed,
            verified,
            completionRate: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0,
            certificationRate: completed > 0 ? Math.round((certified / completed) * 100) : 0,
            employmentRate: completed > 0 ? Math.round((employed / completed) * 100) : 0,
            verifiedRate: employed > 0 ? Math.round((verified / employed) * 100) : 0,
          },
        };
      })
    );

    return effectiveness;
  }

  /**
   * Get employment analytics
   */
  static async getEmploymentAnalytics() {
    const totalEmployment = await Employment.countDocuments();
    const byStatus = await Employment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byType = await Employment.aggregate([
      { $group: { _id: '$employmentType', count: { $sum: 1 } } },
    ]);
    const byDistrict = await Employment.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrend = await Employment.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return {
      totalEmployment,
      byStatus,
      byType,
      byDistrict,
      monthlyTrend,
    };
  }
}

module.exports = AnalyticsService;
