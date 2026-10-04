const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const EmployerProfile = require('../models/EmployerProfile');
const TrainingCentre = require('../models/TrainingCentre');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/constants');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, district, education, skills,
    companyName, industry, address, centreName, department } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists.',
    });
  }

  // Create user
  const user = await User.create({
    name: role === ROLES.EMPLOYER ? companyName : (role === ROLES.TRAINING_CENTRE ? centreName : name),
    email,
    password,
    role,
    phone,
    district,
  });

  // Create role-specific profile
  if (role === ROLES.STUDENT) {
    await StudentProfile.create({
      user: user._id,
      education,
      skills: skills || [],
    });
  } else if (role === ROLES.EMPLOYER) {
    await EmployerProfile.create({
      user: user._id,
      companyName,
      industry,
      address,
    });
  } else if (role === ROLES.TRAINING_CENTRE) {
    await TrainingCentre.create({
      user: user._id,
      centreName,
      district,
      address,
    });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
      },
      token,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  let profile = null;
  if (user.role === ROLES.STUDENT) {
    profile = await StudentProfile.findOne({ user: user._id });
  } else if (user.role === ROLES.EMPLOYER) {
    profile = await EmployerProfile.findOne({ user: user._id });
  } else if (user.role === ROLES.TRAINING_CENTRE) {
    profile = await TrainingCentre.findOne({ user: user._id });
  }

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
    },
  });
});

// @desc    Update current user and role profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.district) user.district = req.body.district;
  await user.save();

  let profile = null;
  if (user.role === ROLES.STUDENT) {
    profile = await StudentProfile.findOneAndUpdate(
      { user: user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
  } else if (user.role === ROLES.EMPLOYER) {
    profile = await EmployerProfile.findOneAndUpdate(
      { user: user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
  } else if (user.role === ROLES.TRAINING_CENTRE) {
    profile = await TrainingCentre.findOneAndUpdate(
      { user: user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user, profile },
  });
});

module.exports = { register, login, logout, getMe, updateProfile };
