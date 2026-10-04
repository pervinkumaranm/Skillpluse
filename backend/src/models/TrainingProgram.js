const mongoose = require('mongoose');
const { TRAINING_MODE } = require('../config/constants');

const trainingProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    skillsCovered: [
      {
        type: String,
        trim: true,
      },
    ],
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    mode: {
      type: String,
      enum: Object.values(TRAINING_MODE),
      default: TRAINING_MODE.OFFLINE,
    },
    eligibility: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    centre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCentre',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    district: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled', 'Upcoming'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

trainingProgramSchema.index({ centre: 1 });
trainingProgramSchema.index({ district: 1 });
trainingProgramSchema.index({ skillsCovered: 1 });
trainingProgramSchema.index({ status: 1 });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
