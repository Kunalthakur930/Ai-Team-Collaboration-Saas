const Comment = require("../models/commentModel");
const Task = require("../models/taskModel");
const Activity = require("../models/activityModel");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const comment = await Comment.create({
      text,
      task: task._id,
      user: req.user._id,
    });
    await Activity.create({
      action: `${req.user.name} commented on task ${task.title} `,
      user: req.user._id,
      workspace: task.workspace,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    })
      .populate("user", " name email")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not autorized to delete" });
    }
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not autorized to edit comment" });
    }
    comment.text = text;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
  editComment,
};
