const { body } = require('express-validator');
const { ROLES } = require('../config/constants');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('district').optional().trim(),
];

const updateSkillsValidator = [
  body('skills')
    .isArray({ min: 0 })
    .withMessage('Skills must be an array'),
  body('skills.*').trim().notEmpty().withMessage('Skill name cannot be empty'),
];

const createTrainingValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('skillsCovered')
    .isArray({ min: 1 })
    .withMessage('At least one skill must be covered'),
];

const createJobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill is needed'),
];

const createEmploymentValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
];

const assessmentValidator = [
  body('title').trim().notEmpty().withMessage('Assessment title is required'),
  body('score')
    .isFloat({ min: 0 })
    .withMessage('Score must be a positive number'),
  body('maxScore')
    .isFloat({ min: 1 })
    .withMessage('Max score must be at least 1'),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  updateSkillsValidator,
  createTrainingValidator,
  createJobValidator,
  createEmploymentValidator,
  assessmentValidator,
};
