const mongoose = require('mongoose');

const trainingCentreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    centreName: {
      type: String,
      required: [true, 'Centre name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    totalPrograms: {
      type: Number,
      default: 0,
    },
    totalStudentsTrained: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

trainingCentreSchema.index({ user: 1 });
trainingCentreSchema.index({ district: 1 });

module.exports = mongoose.model('TrainingCentre', trainingCentreSchema);
