const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createTask,
  getWorkspaceTasks,
  updatedTaskStatus,
  deleteTask,
  assignTask,
  getMyTasks,
  getWorkspaceAnalytics,
} = require("../controllers/taskController");
const router = express.Router();
router.post("/", protect, createTask);
router.get("/workspace/:workspaceId", protect, getWorkspaceTasks);
router.put("/:taskId/status", protect, updatedTaskStatus);
router.get("/my-tasks", protect, getMyTasks);
router.get("/workspace/:workspaceId/analytics", protect, getWorkspaceAnalytics);
router.delete("/:taskId", protect, deleteTask);
router.put("/:taskId/assign", protect, assignTask);
module.exports = router;
