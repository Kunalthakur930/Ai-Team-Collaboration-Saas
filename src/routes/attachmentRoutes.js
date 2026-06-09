const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
} = require("../controllers/attachmentController");

router.post("/:taskId", protect, upload.single("file"), uploadAttachment);

router.get("/:taskId", protect, getTaskAttachments);
router.delete("/:attachmentId", protect, deleteAttachment);

module.exports = router;
