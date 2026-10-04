const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'training_recommendation',
        'job_recommendation',
        'application_update',
        'enrollment_update',
        'employment_verification',
        'new_application',
        'suitable_candidate',
        'new_enrollment',
        'assessment_reminder',
        'analytics_update',
        'general',
      ],
      default: 'general',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
