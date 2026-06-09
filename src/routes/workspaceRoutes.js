const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createWorkspace,
  inviteMember,
  getWorkspaceMembers,
  getWorkspaceActivities,
  promoteToAdmin,
  removeMember,
  requestToJoinWorkspace,
  approveJoinRequest,
} = require("../controllers/workspaceController");
const router = express.Router();
router.post("/", protect, createWorkspace);
router.put("/:workspaceId/invite", protect, inviteMember);
router.get("/:workspaceId/members", protect, getWorkspaceMembers);
router.get("/:workspaceId/activities", protect, getWorkspaceActivities);
router.put("/:workspaceId/promote/:userId", protect, promoteToAdmin);
router.delete("/:workspaceId/remove/:userId", protect, removeMember);
router.post("/:workspaceId/join-request", protect, requestToJoinWorkspace);
router.put("/:workspaceId/approve/:userId", protect, approveJoinRequest);
module.exports = router;
