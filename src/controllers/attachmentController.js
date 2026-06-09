const Task = require("../models/taskModel");
const Attachment = require("../models/attachmentModel");
const fs = require("fs");
const path = require("path");

const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const attachment = await Attachment.create({
      task: task._id,
      uploadedBy: req.user._id,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTaskAttachments = async (req, res) => {
  try {
    const attachments = await Attachment.find({
      task: req.params.taskId,
    }).populate("uploadedBy", "name email");

    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({
        message: "Attachment not found",
      });
    }

    // Only uploader can delete
    if (attachment.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Physical file path
    const filePath = path.join(__dirname, "..", attachment.filePath);

    // Remove physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove DB document
    await attachment.deleteOne();

    res.status(200).json({
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment
};
