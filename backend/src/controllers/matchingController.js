const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const MatchingService = require('../services/matchingService');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, ENROLLMENT_STATUS } = require('../config/constants');

// @desc    Match candidates for a job (reverse matching)
// @route   POST /api/matching/job-candidates
const matchJobCandidates = asyncHandler(async (req, res) => {
  const { requiredSkills, education, preferredDistrict } = req.body;

  if (!requiredSkills || requiredSkills.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one required skill is needed.',
    });
  }

  // Find all students
  const students = await User.find({ role: ROLES.STUDENT });
  const studentIds = students.map((s) => s._id);

  // Get profiles
  const profiles = await StudentProfile.find({ user: { $in: studentIds } });

  // Build candidate data
  const candidates = await Promise.all(
    profiles.map(async (profile) => {
      const user = students.find(
        (s) => s._id.toString() === profile.user.toString()
      );

      const completedTrainings = await Enrollment.countDocuments({
        student: profile.user,
        status: ENROLLMENT_STATUS.COMPLETED,
      });

      const certificates = await Certificate.countDocuments({
        student: profile.user,
      });

      return {
        _id: profile.user,
        name: user?.name || 'N/A',
        email: user?.email || 'N/A',
        district: user?.district || 'N/A',
        skills: profile.skills || [],
        education: profile.education || '',
        experience: profile.experience || 0,
        completedTrainings,
        certificates,
        preferredRole: profile.preferredRole || '',
        preferredLocation: profile.preferredLocation || '',
      };
    })
  );

  // Filter by district if specified
  let filteredCandidates = candidates;
  if (preferredDistrict) {
    filteredCandidates = candidates.filter(
      (c) => c.district.toLowerCase() === preferredDistrict.toLowerCase()
    );
  }

  // Rank candidates
  const rankedCandidates = MatchingService.rankCandidates(filteredCandidates, {
    requiredSkills,
    education: education || '',
  });

  // Filter out zero-score candidates
  const results = rankedCandidates.filter(
    (c) => c.matchResult.totalScore > 0
  );

  res.status(200).json({
    success: true,
    data: {
      totalCandidates: results.length,
      candidates: results.slice(0, 20), // Top 20
    },
  });
});

// @desc    Match jobs for a student
// @route   POST /api/matching/student-jobs
const matchStudentJobs = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const profile = await StudentProfile.findOne({
    user: studentId || req.user._id,
  });

  if (!profile || !profile.skills.length) {
    return res.status(200).json({
      success: true,
      data: {
        message: 'No skills found. Please update your profile.',
        matches: [],
      },
    });
  }

  const Job = require('../models/Job');
  const jobs = await Job.find({ status: 'Published' })
    .populate('employer', 'name')
    .limit(20);

  const matches = jobs.map((job) => {
    const result = MatchingService.calculateSkillMatch(
      profile.skills,
      job.requiredSkills
    );
    return {
      job: {
        _id: job._id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        district: job.district,
        employmentType: job.employmentType,
      },
      ...result,
    };
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    success: true,
    data: {
      studentSkills: profile.skills,
      totalMatches: matches.length,
      matches,
    },
  });
});

module.exports = {
  matchJobCandidates,
  matchStudentJobs,
};
