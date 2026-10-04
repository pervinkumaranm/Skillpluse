const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    targetRole: {
      type: String,
      trim: true,
    },
    studentSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
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
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    gapPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    recommendations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

skillGapSchema.index({ student: 1 });
skillGapSchema.index({ job: 1 });

module.exports = mongoose.model('SkillGap', skillGapSchema);
