const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const total = await Notification.countDocuments({ user: req.user._id });
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    data: { notifications, unreadCount },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found.' });
  }

  res.status(200).json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.status(200).json({ success: true, message: 'Notification deleted.' });
});

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
