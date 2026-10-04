const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    education: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    experienceDetails: {
      type: String,
      trim: true,
    },
    preferredRole: {
      type: String,
      trim: true,
    },
    preferredLocation: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, 'About cannot exceed 500 characters'],
    },
    completedTrainings: {
      type: Number,
      default: 0,
    },
    certificates: {
      type: Number,
      default: 0,
    },
    isEmployed: {
      type: Boolean,
      default: false,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    resumeFileName: {
      type: String,
      trim: true,
    },
    profileCompletion: {
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

// Calculate profile completion before saving
studentProfileSchema.pre('save', function (next) {
  let completion = 0;
  const fields = ['education', 'preferredRole', 'preferredLocation', 'about'];

  fields.forEach((field) => {
    if (this[field] && this[field].toString().trim() !== '') completion += 15;
  });

  if (this.skills && this.skills.length > 0) completion += 20;
  if (this.experience > 0) completion += 20;

  this.profileCompletion = Math.min(completion, 100);
  next();
});

studentProfileSchema.index({ user: 1 });
studentProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
