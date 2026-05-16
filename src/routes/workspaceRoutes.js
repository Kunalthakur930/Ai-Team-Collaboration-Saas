const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createWorkspace,
  inviteMember,
  getWorkspaceMembers,
  getWorkspaceActivities,
} = require("../controllers/workspaceController");
const router = express.Router();
router.post("/", protect, createWorkspace);
router.put("/:workspaceId/invite", protect, inviteMember);
router.get("/:workspaceId/members", protect, getWorkspaceMembers);
router.get("/:workspaceId/activities", protect, getWorkspaceActivities);
module.exports = router;
