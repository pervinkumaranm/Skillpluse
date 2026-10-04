const TrainingProgram = require('../models/TrainingProgram');
const TrainingCentre = require('../models/TrainingCentre');
const Enrollment = require('../models/Enrollment');
const Assessment = require('../models/Assessment');
const Certificate = require('../models/Certificate');
const StudentProfile = require('../models/StudentProfile');
const CertificateService = require('../services/certificateService');
const NotificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const { ENROLLMENT_STATUS } = require('../config/constants');

// @desc    Get all training programs
// @route   GET /api/trainings
const getPrograms = asyncHandler(async (req, res) => {
  const { district, skill, status, search, page = 1, limit = 10 } = req.query;

  const query = {};
  if (district) query.district = district;
  if (status) query.status = status;
  if (skill) query.skillsCovered = { $in: [new RegExp(skill, 'i')] };
  if (search) query.title = { $regex: search, $options: 'i' };

  const total = await TrainingProgram.countDocuments(query);
  const programs = await TrainingProgram.find(query)
    .populate('centre', 'centreName district')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: programs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single program
// @route   GET /api/trainings/:id
const getProgram = asyncHandler(async (req, res) => {
  const program = await TrainingProgram.findById(req.params.id)
    .populate('centre', 'centreName district address');

  if (!program) {
    return res.status(404).json({ success: false, message: 'Training program not found.' });
  }

  const enrollmentCount = await Enrollment.countDocuments({ program: program._id });

  res.status(200).json({
    success: true,
    data: { program, enrollmentCount },
  });
});

// @desc    Create training program
// @route   POST /api/trainings
const createProgram = asyncHandler(async (req, res) => {
  const centre = await TrainingCentre.findOne({ user: req.user._id });
  if (!centre) {
    return res.status(400).json({ success: false, message: 'Training centre profile not found.' });
  }

  const program = await TrainingProgram.create({
    ...req.body,
    centre: centre._id,
    createdBy: req.user._id,
    district: centre.district,
  });

  // Update centre stats
  centre.totalPrograms += 1;
  await centre.save();

  res.status(201).json({
    success: true,
    message: 'Training program created successfully.',
    data: program,
  });
});

// @desc    Update training program
// @route   PUT /api/trainings/:id
const updateProgram = asyncHandler(async (req, res) => {
  let program = await TrainingProgram.findById(req.params.id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Training program not found.' });
  }

  if (program.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this program.' });
  }

  program = await TrainingProgram.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Training program updated successfully.',
    data: program,
  });
});

// @desc    Delete training program
// @route   DELETE /api/trainings/:id
const deleteProgram = asyncHandler(async (req, res) => {
  const program = await TrainingProgram.findById(req.params.id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Training program not found.' });
  }

  if (program.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this program.' });
  }

  await TrainingProgram.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Training program deleted successfully.',
  });
});

// @desc    Enroll student in program
// @route   POST /api/trainings/:id/enroll
const enrollStudent = asyncHandler(async (req, res) => {
  const program = await TrainingProgram.findById(req.params.id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Training program not found.' });
  }

  if (program.enrolled >= program.capacity) {
    return res.status(400).json({ success: false, message: 'Program is at full capacity.' });
  }

  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    program: program._id,
  });

  if (existingEnrollment) {
    return res.status(400).json({ success: false, message: 'Already enrolled in this program.' });
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    program: program._id,
  });

  program.enrolled += 1;
  await program.save();

  // Notify training centre
  await NotificationService.create({
    user: program.createdBy,
    type: 'new_enrollment',
    title: 'New Enrollment',
    message: `A student has enrolled in "${program.title}".`,
    link: `/training/courses/${program._id}`,
  });

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully.',
    data: enrollment,
  });
});

// @desc    Get enrolled students for a program
// @route   GET /api/trainings/:id/students
const getEnrolledStudents = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ program: req.params.id })
    .populate('student', 'name email district');

  res.status(200).json({
    success: true,
    data: enrollments,
  });
});

// @desc    Update enrollment status
// @route   PUT /api/trainings/enrollment/:id
const updateEnrollment = asyncHandler(async (req, res) => {
  const { status, progress, attendance } = req.body;

  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Enrollment not found.' });
  }

  if (status) enrollment.status = status;
  if (progress !== undefined) enrollment.progress = progress;
  if (attendance !== undefined) enrollment.attendance = attendance;

  if (status === ENROLLMENT_STATUS.COMPLETED) {
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  // Notify student
  await NotificationService.create({
    user: enrollment.student,
    type: 'enrollment_update',
    title: 'Training Update',
    message: `Your enrollment status has been updated to "${enrollment.status}".`,
    link: `/student/trainings`,
  });

  res.status(200).json({
    success: true,
    message: 'Enrollment updated successfully.',
    data: enrollment,
  });
});

// @desc    Record assessment
// @route   POST /api/trainings/assessment
const recordAssessment = asyncHandler(async (req, res) => {
  const { enrollmentId, title, score, maxScore, remarks } = req.body;

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Enrollment not found.' });
  }

  const assessment = await Assessment.create({
    enrollment: enrollmentId,
    program: enrollment.program,
    student: enrollment.student,
    title,
    score,
    maxScore,
    remarks,
  });

  res.status(201).json({
    success: true,
    message: 'Assessment recorded successfully.',
    data: assessment,
  });
});

// @desc    Issue certificate
// @route   POST /api/trainings/certificate
const issueCertificate = asyncHandler(async (req, res) => {
  const { enrollmentId, grade } = req.body;

  const enrollment = await Enrollment.findById(enrollmentId).populate('program');
  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Enrollment not found.' });
  }

  if (enrollment.status !== ENROLLMENT_STATUS.COMPLETED) {
    return res.status(400).json({
      success: false,
      message: 'Student must complete the training before receiving a certificate.',
    });
  }

  const centre = await TrainingCentre.findOne({ user: req.user._id });

  const certificate = await CertificateService.issueCertificate({
    student: enrollment.student,
    program: enrollment.program._id,
    centre: centre._id,
    skillsAcquired: enrollment.program.skillsCovered,
    grade,
  });

  // Update student profile
  await StudentProfile.findOneAndUpdate(
    { user: enrollment.student },
    {
      $inc: { certificates: 1 },
      $addToSet: { skills: { $each: enrollment.program.skillsCovered } },
    }
  );

  // Notify student
  await NotificationService.create({
    user: enrollment.student,
    type: 'general',
    title: 'Certificate Issued',
    message: `You have received a certificate for "${enrollment.program.title}".`,
    link: `/student/certificates`,
  });

  res.status(201).json({
    success: true,
    message: 'Certificate issued successfully.',
    data: certificate,
  });
});

// @desc    Get training centre dashboard
// @route   GET /api/trainings/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const centre = await TrainingCentre.findOne({ user: req.user._id });
  if (!centre) {
    return res.status(200).json({ success: true, data: { centre: null } });
  }

  const programs = await TrainingProgram.find({ centre: centre._id });
  const programIds = programs.map((p) => p._id);

  const totalEnrollments = await Enrollment.countDocuments({ program: { $in: programIds } });
  const completedEnrollments = await Enrollment.countDocuments({
    program: { $in: programIds },
    status: ENROLLMENT_STATUS.COMPLETED,
  });
  const totalCertificates = await Certificate.countDocuments({ centre: centre._id });

  res.status(200).json({
    success: true,
    data: {
      centre,
      stats: {
        totalPrograms: programs.length,
        activePrograms: programs.filter((p) => p.status === 'Active').length,
        totalEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
        totalCertificates,
      },
      recentPrograms: programs.slice(0, 5),
    },
  });
});

// @desc    Verify certificate by certificate ID
// @route   GET /api/trainings/certificate/verify/:certificateId
const verifyCertificate = asyncHandler(async (req, res) => {
  const result = await CertificateService.verifyCertificate(req.params.certificateId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  enrollStudent,
  getEnrolledStudents,
  updateEnrollment,
  recordAssessment,
  issueCertificate,
  getDashboard,
  verifyCertificate,
};
