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
      members: [
        {
          user: req.user._id,
          role: "Owner",
        },
      ],
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const currentMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (currentMember.role !== "Owner" && currentMember.role !== "Admin") {
      return res.status(403).json({
        message: "Only admins or owners can invite members",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyMember = workspace.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    workspace.members.push({
      user: user._id,
      role: "Member",
    });

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

const promoteToAdmin = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workpace not found" });
    }
    const currentMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!currentMember || currentMember.role !== "Owner") {
      return res
        .status(403)
        .json({ message: "Only workspace owner can promote members " });
    }
    const targetMember = workspace.members.find((member) =>
      member.user._id
        ? member.user._id.toString() === req.params.userId
        : member.user.toString() === req.params.userId,
    );
    if (!targetMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    targetMember.role = "Admin";
    workspace.markModified("members");
    await workspace.save();
    res.status(200).json({ message: "Member promoted to Admin" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Current logged-in member
    const currentMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Target member
    const targetMember = workspace.members.find(
      (member) => member.user.toString() === req.params.userId,
    );

    if (!targetMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Owner rules
    if (currentMember.role === "Owner") {
      if (targetMember.user.toString() === req.user._id.toString()) {
        return res.status(400).json({
          message: "Owner cannot remove themselves",
        });
      }
    }

    // Admin rules
    else if (currentMember.role === "Admin") {
      if (targetMember.role !== "Member") {
        return res.status(403).json({
          message: "Admins can only remove members",
        });
      }
    }

    // Member cannot remove
    else {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== req.params.userId,
    );

    workspace.markModified("members");

    await workspace.save();

    res.status(200).json({
      message: "Member removed successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const requestToJoinWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const alreadyMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "Already a workspace member" });
    }
    const existingRequest = workspace.joinRequests.find(
      (request) => request.user.toString() === req.user._id.toString(),
    );
    if (existingRequest) {
      return res.status(400).json({ message: "Join request already sent" });
    }
    workspace.joinRequests.push({
      user: req.user._id,
      status: "Pending",
    });
    workspace.markModified("joinRequests");
    await workspace.save();
    res.status(200).json({ message: "Join request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Current logged-in member
    const currentMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    // Only Owner/Admin can approve
    if (
      !currentMember ||
      (currentMember.role !== "Owner" && currentMember.role !== "Admin")
    ) {
      return res.status(403).json({
        message: "Only admins or owners can approve requests",
      });
    }

    // Find join request
    const request = workspace.joinRequests.find(
      (request) => request.user.toString() === req.params.userId,
    );

    if (!request) {
      return res.status(404).json({
        message: "Join request not found",
      });
    }

    // Add member
    workspace.members.push({
      user: request.user,
      role: "Member",
    });

    // Remove request
    workspace.joinRequests = workspace.joinRequests.filter(
      (request) => request.user.toString() !== req.params.userId,
    );

    workspace.markModified("members");
    workspace.markModified("joinRequests");

    await workspace.save();

    res.status(200).json({
      message: "Join request approved successfully",
      workspace,
    });
  } catch (error) {
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
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const activities = await Activity.find({
      workspace: req.params.workspaceId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createWorkspace,
  inviteMember,
  getWorkspaceMembers,
  getWorkspaceActivities,
  promoteToAdmin,
  removeMember,
  requestToJoinWorkspace,
  approveJoinRequest,
};
