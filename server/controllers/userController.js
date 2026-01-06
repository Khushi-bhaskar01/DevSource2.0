import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getUserData = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badges: user.badges,
        domain: user.domain,
        aboutMe: user.aboutMe,
        linkedin: user.linkedin,
        github: user.github,
        branch: user.branch,
        role: user.role,
        year: user.year,
        location: user.location,
        profilePicture: user.profilePicture,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error);
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
