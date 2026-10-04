const Employment = require('../models/Employment');
const User = require('../models/User');
const EmployerProfile = require('../models/EmployerProfile');
const StudentProfile = require('../models/StudentProfile');
const NotificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const { EMPLOYMENT_STATUS, ROLES } = require('../config/constants');

// @desc    Report employment
// @route   POST /api/employment
const reportEmployment = asyncHandler(async (req, res) => {
  const { companyName, jobTitle, joiningDate, employmentType, salary, district, job } = req.body;

  const employment = await Employment.create({
    student: req.user._id,
    companyName,
    jobTitle,
    joiningDate,
    employmentType,
    salary,
    district: district || req.user.district,
    job,
    status: EMPLOYMENT_STATUS.SELF_REPORTED,
  });

  // Update student profile
  await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    { isEmployed: true }
  );

  res.status(201).json({
    success: true,
    message: 'Employment reported successfully.',
    data: employment,
  });
});

// @desc    Upload proof document
// @route   PUT /api/employment/:id/upload-proof
const uploadProof = asyncHandler(async (req, res) => {
  const employment = await Employment.findById(req.params.id);
  if (!employment) {
    return res.status(404).json({ success: false, message: 'Employment record not found.' });
  }

  if (employment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file.' });
  }

  employment.proofDocument = req.file.filename;
  employment.status = EMPLOYMENT_STATUS.PENDING_VERIFICATION;
  await employment.save();

  res.status(200).json({
    success: true,
    message: 'Proof document uploaded successfully.',
    data: employment,
  });
});

// @desc    Verify employment (Employer or Government)
// @route   PUT /api/employment/:id/verify
const verifyEmployment = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const employment = await Employment.findById(req.params.id);
  if (!employment) {
    return res.status(404).json({ success: false, message: 'Employment record not found.' });
  }

  const allowedStatuses = [
    EMPLOYMENT_STATUS.EMPLOYER_VERIFIED,
    EMPLOYMENT_STATUS.GOVERNMENT_VERIFIED,
    EMPLOYMENT_STATUS.REJECTED,
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid verification status.' });
  }

  employment.status = status;
  employment.verifiedBy = req.user._id;
  employment.verifiedAt = new Date();
  if (remarks) employment.verificationRemarks = remarks;
  await employment.save();

  // Notify student
  await NotificationService.create({
    user: employment.student,
    type: 'employment_verification',
    title: 'Employment Verification Update',
    message: `Your employment at "${employment.companyName}" has been ${status.toLowerCase()}.`,
    link: `/student/employment`,
  });

  res.status(200).json({
    success: true,
    message: 'Employment verification updated.',
    data: employment,
  });
});

// @desc    Get employment records
// @route   GET /api/employment
const getEmployment = asyncHandler(async (req, res) => {
  const { status, district, page = 1, limit = 10 } = req.query;

  const query = {};

  // Role-based filtering
  if (req.user.role === ROLES.STUDENT) {
    query.student = req.user._id;
  } else if (req.user.role === ROLES.EMPLOYER) {
    const profile = await EmployerProfile.findOne({ user: req.user._id });
    if (profile) {
      query.companyName = profile.companyName;
    }
  }

  if (status) query.status = status;
  if (district) query.district = district;

  const total = await Employment.countDocuments(query);
  const records = await Employment.find(query)
    .populate('student', 'name email district')
    .populate('verifiedBy', 'name role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: records,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = {
  reportEmployment,
  uploadProof,
  verifyEmployment,
  getEmployment,
};
