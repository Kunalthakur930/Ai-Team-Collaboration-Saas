const Task = require("../models/taskModel");
const Workspace = require("../models/workspaceModel");
const Activity = require("../models/activityModel");
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, workspace, assignedTo } =
      req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      workspace,
      assignedTo,
      createdBy: req.user._id,
    });
    await Activity.create({
      action: `${req.user.name} created task ${title}`,
      user: req.user._id,
      workspace,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const isMember = workspace.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }
    const tasks = await Task.find({
      workspace: workspaceId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatedTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }
    task.status = status;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Not authorized to delete this task" });
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.assignedTo = userId;
    await task.save();
    res.status(200).json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("workspace", "name")
      .populate("createdBy", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const isMember = await workspace.members.some(
      (memberId) => memberId.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }
    const totalTasks = await Task.countDocuments({ workspace: workspaceId });
    const todoTasks = await Task.countDocuments({
      workspace: workspaceId,
      status: "Todo",
    });
    const inProgressTasks = await Task.countDocuments({
      workspace: workspaceId,
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({
      workspace: workspaceId,
      status: "Done",
    });
    res
      .status(200)
      .json({ totalTasks, todoTasks, inProgressTasks, completedTasks });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createTask,
  getWorkspaceTasks,
  updatedTaskStatus,
  deleteTask,
  assignTask,
  getMyTasks,
  getWorkspaceAnalytics,
};
