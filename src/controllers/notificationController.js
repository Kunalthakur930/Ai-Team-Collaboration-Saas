const Notification = require("../models/notificationModel");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    notification.read = true;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
};
