const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    employeeCount: {
      type: String,
      trim: true,
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
    totalHires: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

employerProfileSchema.index({ user: 1 });
employerProfileSchema.index({ industry: 1 });

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
