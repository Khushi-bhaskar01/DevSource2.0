import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
export const getUserData = async (req, res) => {
  try {
    const allUsers = await userModel.find({}, "name domain linkedin points email role");

    const groupedMembers = {
      webDev: allUsers.filter((u) => u.domain?.includes("web")),
      gameDev: allUsers.filter((u) => u.domain?.includes("game")),
      appDev: allUsers.filter((u) => u.domain?.includes("app")),
    };

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        domain: req.user.domain,
        points: req.user.points,
        profilePicture: req.user.profilePicture,
      },
      members: groupedMembers,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id).populate("badges");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    // If password is being updated, hash it first
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("name domain linkedin points profilePicture badges");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};
export const getMyUserTasks = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const userTaskModel = (await import('../models/userTask.js')).default;
    const items = await userTaskModel.find({ email });
    res.json({ success: true, tasks: items });
  } catch (err) {
    console.error('getMyUserTasks error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user tasks' });
  }
};