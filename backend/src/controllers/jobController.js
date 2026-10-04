const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const StudentProfile = require('../models/StudentProfile');
const EmployerProfile = require('../models/EmployerProfile');
const MatchingService = require('../services/matchingService');
const NotificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { district, skill, type, search, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (district) query.district = district;
  if (type) query.employmentType = type;
  if (status) query.status = status;
  else query.status = 'Published';
  if (skill) query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate('employer', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: jobs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name');
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  // If student, calculate match score
  let matchResult = null;
  if (req.user && req.user.role === 'student') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile && profile.skills.length > 0) {
      matchResult = MatchingService.calculateSkillMatch(
        profile.skills,
        job.requiredSkills
      );
    }
  }

  res.status(200).json({
    success: true,
    data: { job, matchResult },
  });
});

// @desc    Create job
// @route   POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const employerProfile = await EmployerProfile.findOne({ user: req.user._id });

  const job = await Job.create({
    ...req.body,
    employer: req.user._id,
    companyName: employerProfile?.companyName || req.user.name,
  });

  // Update employer stats
  if (employerProfile) {
    employerProfile.totalJobsPosted += 1;
    await employerProfile.save();
  }

  res.status(201).json({
    success: true,
    message: 'Job posted successfully.',
    data: job,
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Job updated successfully.',
    data: job,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully.',
  });
});

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
const applyForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  if (job.status !== 'Published') {
    return res.status(400).json({ success: false, message: 'This job is no longer accepting applications.' });
  }

  const existingApplication = await JobApplication.findOne({
    student: req.user._id,
    job: job._id,
  });

  if (existingApplication) {
    return res.status(400).json({ success: false, message: 'Already applied for this job.' });
  }

  // Calculate match score
  const profile = await StudentProfile.findOne({ user: req.user._id });
  const matchResult = MatchingService.calculateSkillMatch(
    profile?.skills || [],
    job.requiredSkills
  );

  const application = await JobApplication.create({
    student: req.user._id,
    job: job._id,
    matchScore: matchResult.matchScore,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    coverNote: req.body.coverNote,
  });

  // Update job application count
  job.applicationsCount += 1;
  await job.save();

  // Notify employer
  await NotificationService.create({
    user: job.employer,
    type: 'new_application',
    title: 'New Job Application',
    message: `A candidate applied for "${job.title}" with ${matchResult.matchScore}% skill match.`,
    link: `/employer/jobs/${job._id}`,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    data: application,
  });
});

// @desc    Get applications for a job (employer)
// @route   GET /api/jobs/:id/applications
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const applications = await JobApplication.find({ job: job._id })
    .populate('student', 'name email district')
    .sort({ matchScore: -1 });

  res.status(200).json({
    success: true,
    data: applications,
  });
});

// @desc    Update application status
// @route   PUT /api/jobs/application/:id
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const application = await JobApplication.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  application.status = status;
  if (remarks) application.remarks = remarks;
  application.reviewedAt = new Date();
  await application.save();

  // Notify student
  await NotificationService.create({
    user: application.student,
    type: 'application_update',
    title: 'Application Update',
    message: `Your application status has been updated to "${status}".`,
    link: `/student/applications`,
  });

  res.status(200).json({
    success: true,
    message: 'Application status updated.',
    data: application,
  });
});

// @desc    Get student's applications
// @route   GET /api/jobs/my-applications
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ student: req.user._id })
    .populate({
      path: 'job',
      select: 'title companyName location district employmentType status',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: applications,
  });
});

// @desc    Get employer's jobs
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: jobs,
  });
});

// @desc    Get all applications across all employer's jobs
// @route   GET /api/jobs/employer/all-applications
const getEmployerApplications = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).select('_id');
  const jobIds = jobs.map((j) => j._id);
  const applications = await JobApplication.find({ job: { $in: jobIds } })
    .populate('student', 'name email district skills')
    .populate('job', 'title location district employmentType status companyName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: applications,
  });
});

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getMyApplications,
  getMyJobs,
  getEmployerApplications,
};

