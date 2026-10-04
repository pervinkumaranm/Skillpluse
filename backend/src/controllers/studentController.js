const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Employment = require('../models/Employment');
const SkillGap = require('../models/SkillGap');
const TrainingProgram = require('../models/TrainingProgram');
const MatchingService = require('../services/matchingService');
const { extractRawText, parseResumeText } = require('../services/resumeParserService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get student profile
// @route   GET /api/students/profile
const getProfile = asyncHandler(async (req, res) => {
  let profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = await StudentProfile.create({ user: req.user._id });
  }

  const user = await User.findById(req.user._id);
  const enrollments = await Enrollment.countDocuments({ student: req.user._id });
  const completedTrainings = await Enrollment.countDocuments({
    student: req.user._id,
    status: 'Completed',
  });
  const certificates = await Certificate.countDocuments({ student: req.user._id });
  const employment = await Employment.findOne({ student: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
      stats: {
        enrollments,
        completedTrainings,
        certificates,
        isEmployed: !!employment,
        employmentStatus: employment?.status || null,
      },
    },
  });
});

// @desc    Update student profile
// @route   PUT /api/students/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, district, education, experience, experienceDetails,
    preferredRole, preferredLocation, about } = req.body;

  // Update user fields
  if (name || phone || district) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(district && { district }),
    });
  }

  // Update or create profile
  let profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new StudentProfile({ user: req.user._id });
  }

  if (education !== undefined) profile.education = education;
  if (experience !== undefined) profile.experience = experience;
  if (experienceDetails !== undefined) profile.experienceDetails = experienceDetails;
  if (preferredRole !== undefined) profile.preferredRole = preferredRole;
  if (preferredLocation !== undefined) profile.preferredLocation = preferredLocation;
  if (about !== undefined) profile.about = about;

  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: profile,
  });
});

// @desc    Get student skills
// @route   GET /api/students/skills
const getSkills = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  res.status(200).json({
    success: true,
    data: { skills: profile?.skills || [] },
  });
});

// @desc    Update student skills
// @route   PUT /api/students/skills
const updateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  let profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new StudentProfile({ user: req.user._id });
  }

  profile.skills = skills.map((s) => s.trim());
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Skills updated successfully.',
    data: { skills: profile.skills },
  });
});

// @desc    Get skill gap analysis
// @route   GET /api/students/skill-gap
const getSkillGap = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile || !profile.skills.length) {
    return res.status(200).json({
      success: true,
      data: {
        message: 'Please add your skills first to see skill gap analysis.',
        gaps: [],
      },
    });
  }

  // Get published jobs
  const jobs = await Job.find({ status: 'Published' })
    .select('title requiredSkills companyName district')
    .limit(20);

  const gaps = jobs.map((job) => {
    const result = MatchingService.calculateSkillMatch(
      profile.skills,
      job.requiredSkills
    );
    return {
      job: {
        _id: job._id,
        title: job.title,
        companyName: job.companyName,
        district: job.district,
      },
      ...result,
    };
  });

  // Sort by match score descending
  gaps.sort((a, b) => b.matchScore - a.matchScore);

  // Overall skill gap summary
  const allRequiredSkills = [...new Set(jobs.flatMap((j) => j.requiredSkills))];
  const overallResult = MatchingService.calculateSkillMatch(
    profile.skills,
    allRequiredSkills
  );

  res.status(200).json({
    success: true,
    data: {
      studentSkills: profile.skills,
      overallGap: overallResult,
      jobGaps: gaps,
    },
  });
});

// @desc    Get recommended jobs
// @route   GET /api/students/recommended-jobs
const getRecommendedJobs = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);

  const jobs = await Job.find({ status: 'Published' })
    .populate('employer', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  const recommendedJobs = jobs.map((job) => {
    const skillResult = MatchingService.calculateSkillMatch(
      profile?.skills || [],
      job.requiredSkills
    );

    return {
      job,
      matchScore: skillResult.matchScore,
      matchedSkills: skillResult.matchedSkills,
      missingSkills: skillResult.missingSkills,
    };
  });

  // Sort by match score descending
  recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    success: true,
    data: recommendedJobs,
  });
});

// @desc    Get recommended training
// @route   GET /api/students/recommended-trainings
const getRecommendedTrainings = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  // Find skills that are missing (from jobs)
  const jobs = await Job.find({ status: 'Published' }).select('requiredSkills');
  const allRequiredSkills = [...new Set(jobs.flatMap((j) => j.requiredSkills))];

  const { missingSkills } = MatchingService.calculateSkillMatch(
    profile?.skills || [],
    allRequiredSkills
  );

  // Find training programs that cover missing skills
  const trainings = await TrainingProgram.find({
    status: 'Active',
    skillsCovered: { $in: missingSkills.map((s) => new RegExp(s, 'i')) },
  })
    .populate('centre', 'centreName district')
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      missingSkills,
      recommendedTrainings: trainings,
    },
  });
});

// @desc    Upload & Parse student resume
// @route   POST /api/students/resume
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a resume file to upload.' });
  }

  let profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new StudentProfile({ user: req.user._id });
  }

  profile.resumeUrl = `/uploads/${req.file.filename}`;
  profile.resumeFileName = req.file.originalname;

  // Extract & parse resume text
  let parsedData = {};
  try {
    const rawText = await extractRawText(req.file.path, req.file.mimetype);
    if (rawText && rawText.trim().length > 0) {
      parsedData = parseResumeText(rawText);

      // Auto-fill profile fields if extracted
      if (parsedData.education) profile.education = parsedData.education;
      if (parsedData.preferredRole) profile.preferredRole = parsedData.preferredRole;
      if (parsedData.preferredLocation) profile.preferredLocation = parsedData.preferredLocation;
      if (parsedData.experience > 0) profile.experience = parsedData.experience;
      if (parsedData.about) profile.about = parsedData.about;

      // Merge newly extracted skills with existing skills without duplicates
      if (parsedData.skills && parsedData.skills.length > 0) {
        const existingSkills = new Set(profile.skills || []);
        parsedData.skills.forEach((s) => existingSkills.add(s));
        profile.skills = Array.from(existingSkills);
      }

      // Update user name/phone/district if extracted
      const user = await User.findById(req.user._id);
      if (user) {
        if (parsedData.name && parsedData.name.length >= 3) user.name = parsedData.name;
        if (parsedData.phone) user.phone = parsedData.phone;
        if (parsedData.district) user.district = parsedData.district;
        await user.save();
      }
    }
  } catch (parseErr) {
    console.warn('Resume parse warning:', parseErr.message);
  }

  await profile.save();

  // Fetch updated user to return
  const updatedUser = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    success: true,
    message: 'Resume uploaded and details auto-filled successfully!',
    data: {
      resumeUrl: profile.resumeUrl,
      resumeFileName: profile.resumeFileName,
      parsedData,
      profile,
      user: updatedUser,
    },
  });
});

// @desc    Delete student resume
// @route   DELETE /api/students/resume
const deleteResume = asyncHandler(async (req, res) => {
  let profile = await StudentProfile.findOne({ user: req.user._id });
  if (profile) {
    profile.resumeUrl = null;
    profile.resumeFileName = null;
    await profile.save();
  }

  res.status(200).json({
    success: true,
    message: 'Resume removed successfully.',
    data: profile,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getSkillGap,
  getRecommendedJobs,
  getRecommendedTrainings,
  uploadResume,
  deleteResume,
};
