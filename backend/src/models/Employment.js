const mongoose = require('mongoose');
const { EMPLOYMENT_STATUS: EMP_STATUS } = require('../config/constants');

const employmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    employmentType: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
    },
    district: {
      type: String,
      trim: true,
    },
    proofDocument: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(EMP_STATUS),
      default: EMP_STATUS.SELF_REPORTED,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    verificationRemarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

employmentSchema.index({ student: 1 });
employmentSchema.index({ employer: 1 });
employmentSchema.index({ status: 1 });
employmentSchema.index({ district: 1 });

module.exports = mongoose.model('Employment', employmentSchema);
