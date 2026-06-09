const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  addComment,
  getTaskComments,
  deleteComment,
  editComment,
} = require("../controllers/commentController");
router.post("/:taskId", protect, addComment);
router.get("/:taskId", protect, getTaskComments);
router.delete("/:commentId", protect, deleteComment);
router.put("/:commentId", protect, editComment);

module.exports = router;
