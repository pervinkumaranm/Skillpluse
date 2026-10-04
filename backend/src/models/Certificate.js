const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema(
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
    centre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCentre',
      required: true,
    },
    certificateId: {
      type: String,
      unique: true,
    },
    skillsAcquired: [
      {
        type: String,
        trim: true,
      },
    ],
    issueDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'Pass'],
      default: 'Pass',
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique certificate ID before saving
certificateSchema.pre('save', function (next) {
  if (!this.certificateId) {
    const prefix = 'SP';
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.certificateId = `${prefix}-${year}-${random}`;
  }
  next();
});

certificateSchema.index({ student: 1 });
certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ program: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
