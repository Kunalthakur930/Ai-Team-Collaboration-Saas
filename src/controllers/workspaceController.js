const Workspace = require("../models/workspaceModel");
const User = require("../models/UserModel");
const Activity = require("../models/activityModel");
const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Workspace ID:", req.params.workspaceId);

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyMember = workspace.members.includes(user._id);

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    workspace.members.push(user._id);

    await workspace.save();

    res.status(200).json({
      message: "Member added successfully",
      workspace,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate(
      "members",
      "name email",
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace.members);
  } catch (error) {
    res.status(501).json(error.message);
  }
};

const getWorkspaceActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      workspace: req.params.workspaceId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createWorkspace,
  inviteMember,
  getWorkspaceMembers,
  getWorkspaceActivities,
};
