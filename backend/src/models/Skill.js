const mongoose = require('mongoose');
const { SKILL_CATEGORIES } = require('../config/constants');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: SKILL_CATEGORIES,
      default: 'Other',
    },
    description: {
      type: String,
      trim: true,
    },
    demandScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    supplyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ demandScore: -1 });

module.exports = mongoose.model('Skill', skillSchema);
