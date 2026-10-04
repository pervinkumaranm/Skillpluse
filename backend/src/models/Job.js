const mongoose = require('mongoose');
const { JOB_STATUS, EMPLOYMENT_TYPES } = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: 'Full Time',
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    experience: {
      type: String,
      trim: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PUBLISHED,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ employer: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ district: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
