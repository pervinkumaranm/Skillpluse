const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create a single notification
   */
  static async create({ user, type, title, message, link }) {
    return await Notification.create({ user, type, title, message, link });
  }

  /**
   * Create notifications for multiple users
   */
  static async createBulk(userIds, { type, title, message, link }) {
    const notifications = userIds.map((userId) => ({
      user: userId,
      type,
      title,
      message,
      link,
    }));
    return await Notification.insertMany(notifications);
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId) {
    return await Notification.countDocuments({ user: userId, read: false });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllRead(userId) {
    return await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }
}

module.exports = NotificationService;
