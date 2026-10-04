const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingProgram',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: 0,
    },
    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      min: 1,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    assessedAt: {
      type: Date,
      default: Date.now,
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

// Calculate percentage and pass status before saving
assessmentSchema.pre('save', function (next) {
  this.percentage = Math.round((this.score / this.maxScore) * 100);
  this.passed = this.percentage >= 40; // 40% passing threshold
  next();
});

assessmentSchema.index({ student: 1 });
assessmentSchema.index({ program: 1 });
assessmentSchema.index({ enrollment: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
