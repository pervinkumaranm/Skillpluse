const AnalyticsService = require('../services/analyticsService');
const Employment = require('../models/Employment');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get government overview
// @route   GET /api/government/overview
const getOverview = asyncHandler(async (req, res) => {
  const overview = await AnalyticsService.getOverview();
  res.status(200).json({ success: true, data: overview });
});

// @desc    Get district analytics
// @route   GET /api/government/districts
const getDistrictAnalytics = asyncHandler(async (req, res) => {
  const data = await AnalyticsService.getDistrictAnalytics();
  res.status(200).json({ success: true, data });
});

// @desc    Get skill analytics
// @route   GET /api/government/skills
const getSkillAnalytics = asyncHandler(async (req, res) => {
  const data = await AnalyticsService.getSkillAnalytics();
  res.status(200).json({ success: true, data });
});

// @desc    Get training effectiveness
// @route   GET /api/government/training-effectiveness
const getTrainingEffectiveness = asyncHandler(async (req, res) => {
  const data = await AnalyticsService.getTrainingEffectiveness();
  res.status(200).json({ success: true, data });
});

// @desc    Get employment analytics
// @route   GET /api/government/employment
const getEmploymentAnalytics = asyncHandler(async (req, res) => {
  const data = await AnalyticsService.getEmploymentAnalytics();
  res.status(200).json({ success: true, data });
});

// @desc    Export report as CSV
// @route   GET /api/government/export/:type
const exportReport = asyncHandler(async (req, res) => {
  const { type } = req.params;

  let data;
  let headers;
  let filename;

  switch (type) {
    case 'employment':
      data = await Employment.find()
        .populate('student', 'name email district')
        .lean();
      headers = ['Student Name', 'Email', 'Company', 'Job Title', 'District', 'Status', 'Joining Date'];
      filename = 'employment_report.csv';
      
      const csvRows = [headers.join(',')];
      data.forEach((record) => {
        csvRows.push([
          record.student?.name || 'N/A',
          record.student?.email || 'N/A',
          record.companyName,
          record.jobTitle,
          record.district || 'N/A',
          record.status,
          record.joiningDate ? new Date(record.joiningDate).toLocaleDateString() : 'N/A',
        ].map(v => `"${v}"`).join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      return res.send(csvRows.join('\n'));

    case 'training':
      const effectiveness = await AnalyticsService.getTrainingEffectiveness();
      headers = ['Program', 'Centre', 'Enrolled', 'Completed', 'Certified', 'Employed', 'Completion Rate', 'Employment Rate'];
      filename = 'training_effectiveness_report.csv';

      const trainingRows = [headers.join(',')];
      effectiveness.forEach((item) => {
        trainingRows.push([
          item.program.title,
          item.program.centre,
          item.metrics.enrolled,
          item.metrics.completed,
          item.metrics.certified,
          item.metrics.employed,
          `${item.metrics.completionRate}%`,
          `${item.metrics.employmentRate}%`,
        ].map(v => `"${v}"`).join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      return res.send(trainingRows.join('\n'));

    case 'skills':
      const skillData = await AnalyticsService.getSkillAnalytics();
      headers = ['Skill', 'Demand', 'Supply', 'Gap'];
      filename = 'skill_analytics_report.csv';

      const skillRows = [headers.join(',')];
      skillData.skillAnalytics.forEach((item) => {
        skillRows.push([
          item.skill,
          item.demand,
          item.supply,
          item.demand - item.supply,
        ].map(v => `"${v}"`).join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      return res.send(skillRows.join('\n'));

    default:
      return res.status(400).json({ success: false, message: 'Invalid report type.' });
  }
});

module.exports = {
  getOverview,
  getDistrictAnalytics,
  getSkillAnalytics,
  getTrainingEffectiveness,
  getEmploymentAnalytics,
  exportReport,
};
