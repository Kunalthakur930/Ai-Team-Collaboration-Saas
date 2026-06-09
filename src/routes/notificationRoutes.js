const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");
router.get("/", protect, getMyNotifications);
router.put("/:notificationId/read", protect, markNotificationAsRead);
router.get("/unread/count", protect, getUnreadNotificationCount);
module.exports = router;
