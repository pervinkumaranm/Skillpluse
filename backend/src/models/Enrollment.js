const mongoose = require('mongoose');
const { ENROLLMENT_STATUS } = require('../config/constants');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingProgram',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.PENDING,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment
enrollmentSchema.index({ student: 1, program: 1 }, { unique: true });
enrollmentSchema.index({ status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
