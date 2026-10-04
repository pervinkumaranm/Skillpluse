const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'District name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalTrainingCentres: {
      type: Number,
      default: 0,
    },
    totalEmployers: {
      type: Number,
      default: 0,
    },
    totalEmployed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

districtSchema.index({ name: 1 });
districtSchema.index({ code: 1 });

module.exports = mongoose.model('District', districtSchema);
