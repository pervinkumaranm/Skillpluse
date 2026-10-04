const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../config/constants');

const jobApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    matchedSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    coverNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Cover note cannot exceed 1000 characters'],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
jobApplicationSchema.index({ student: 1, job: 1 }, { unique: true });
jobApplicationSchema.index({ job: 1 });
jobApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
