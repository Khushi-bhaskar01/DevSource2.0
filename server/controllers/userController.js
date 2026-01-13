// import userModel from "../models/userModel.js";
// import bcrypt from "bcryptjs";

// export const getUserData = async (req, res) => {
//   try {
//     // Fetch all members from the database (only needed fields)
//     const allUsers = await userModel.find({}, "name domain linkedin");

//     // Group users by their domain (handling array type)
//     const groupedMembers = {
//       webDev: allUsers.filter((u) => Array.isArray(u.domain) && u.domain.includes("web")),
//       gameDev: allUsers.filter((u) => Array.isArray(u.domain) && u.domain.includes("game")),
//       appDev: allUsers.filter((u) => Array.isArray(u.domain) && u.domain.includes("app")),
//     };

//     // Respond with logged-in user info + grouped members (minimal user info)
//     res.json({
//       success: true,
//       members: groupedMembers,
//     });
//   } catch (error) {
//     console.error("getUserData error:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch user data" });
//   }
// };


// export const getUserProfile = async (req, res) => {
//   try {
//     // Authorization: only owner or admins can fetch arbitrary profiles
//     const requesterId = req.user?._id?.toString() || req.user?.id;
//     const targetId = req.params.id;

//     if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

//     const isAdmin = req.user?.role === "admin" || req.user?.role === "superadmin";
//     if (requesterId !== targetId && !isAdmin) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const user = await userModel.findById(targetId).populate("badges");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Return safe fields only
//     const safeUser = user.toObject();
//     delete safeUser.password;
//     delete safeUser.verifyOtp;
//     delete safeUser.resetOtp;

//     res.json({ success: true, user: safeUser });
//   } catch (err) {
//     console.error("getUserProfile error:", err);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// };

// // Public profile endpoint: does NOT require authentication
// export const getPublicProfile = async (req, res) => {
//   try {
//     const targetId = req.params.id;
//     const user = await userModel.findById(targetId).populate("badges");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const safe = {
//       _id: user._id,
//       name: user.name,
//       username: user.username,
//       domain: user.domain || [],
//       linkedin: user.linkedin || "",
//       badges: user.badges || [],
//       points: user.points || 0,
//       profilePicture: user.profilePicture || null,
//     };

//     res.json({ success: true, user: safe });
//   } catch (err) {
//     console.error("getPublicProfile error:", err);
//     res.status(500).json({ message: "Failed to fetch public profile" });
//   }
// };

// export const updateUserProfile = async (req, res) => {
//   try {
//     const requesterId = req.user?._id?.toString() || req.user?.id;
//     const targetId = req.params.id;

//     if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

//     const isAdmin = req.user?.role === "admin" || req.user?.role === "superadmin";
//     if (requesterId !== targetId && !isAdmin) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // Only allow a whitelist of fields to be updated to avoid accidental wipes
//     const allowedFields = [
//       "name",
//       "aboutMe",
//       "location",
//       "branch",
//       "year",
//       "linkedin",
//       "github",
//       "domain",
//       "profilePicture",
//       "password",
//     ];

//     // Build $set object, ignoring undefined/empty values
//     const setUpdates = {};
//     for (const key of allowedFields) {
//       if (!Object.prototype.hasOwnProperty.call(req.body, key)) continue;
//       const val = req.body[key];

//       // Ignore undefined or null
//       if (val === undefined || val === null) continue;

//       // Ignore empty strings
//       if (typeof val === "string" && val.trim() === "") continue;

//       // Ignore empty arrays
//       if (Array.isArray(val) && val.length === 0) continue;

//       setUpdates[key] = val;
//     }

//     // If no valid updates provided, return current user without modifying DB
//     if (Object.keys(setUpdates).length === 0) {
//       const current = await userModel.findById(targetId).select("-password -verifyOtp -resetOtp");
//       if (!current) return res.status(404).json({ message: "User not found" });
//       return res.json({ success: true, user: current });
//     }

//     // If password is being updated, hash it first
//     if (setUpdates.password) {
//       setUpdates.password = await bcrypt.hash(String(setUpdates.password), 10);
//     }

//     const updated = await userModel.findByIdAndUpdate(
//       targetId,
//       { $set: setUpdates },
//       { new: true, runValidators: true }
//     ).select("-password -verifyOtp -resetOtp");

//     if (!updated) return res.status(404).json({ message: "User not found" });

//     res.json({ success: true, user: updated });
//   } catch (err) {
//     console.error("updateUserProfile error:", err);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// };

// // Create or update a user task submission (status -> pending)
// export const submitUserTask = async (req, res) => {
//   try {
//     const { taskid, github, demo } = req.body;
//     const email = req.user?.email;
//     if (!email || !taskid || !github) {
//       return res.status(400).json({ success: false, message: 'Missing details' });
//     }

//     // ensure task exists
//     const task = await (await import('../models/taskModel.js')).default.findOne({ taskid });
//     if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

//     const userTaskModel = (await import('../models/userTask.js')).default;

//     const existing = await userTaskModel.findOne({ email, taskid });
//     if (existing) {
//       // if already approved, don't allow resubmit
//       if (existing.status === 'approved') {
//         return res.status(409).json({ success: false, message: 'Task already approved' });
//       }
//       // update github/demo and set to pending
//       existing.github = github;
//       existing.demo = demo || '';
//       existing.status = 'pending';
//       const saved = await existing.save();
//       return res.json({ success: true, userTask: saved });
//     }

//     const newUT = new userTaskModel({ email, taskid, github, demo: demo || '', status: 'pending' });
//     await newUT.save();
//     return res.json({ success: true, userTask: newUT });
//   } catch (err) {
//     console.error('submitUserTask error:', err);
//     res.status(500).json({ success: false, message: 'Failed to submit task' });
//   }
// };

// export const getMyUserTasks = async (req, res) => {
//   try {
//     const email = req.user?.email;
//     if (!email) return res.status(401).json({ success: false, message: 'Unauthorized' });
//     const userTaskModel = (await import('../models/userTask.js')).default;
//     const items = await userTaskModel.find({ email });
//     res.json({ success: true, tasks: items });
//   } catch (err) {
//     console.error('getMyUserTasks error:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch user tasks' });
//   }
// };

// export const getAllTasksForUsers = async (req, res) => {
//   try {
//     const Task = (await import("../models/taskModel.js")).default;
//     const tasks = await Task.find({ isActive: true });
//     res.json({ success: true, tasks });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch tasks" });
//   }
// };


// export const getLeaderboard = async (req, res) => {
//   try {
//     const users = await userModel.find().sort({ points: -1 }).limit(20);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

/* ================= USER DATA ================= */
export const getUserData = async (req, res) => {
  try {
    const allUsers = await userModel.find({}, "name domain linkedin");

    const groupedMembers = {
      webDev: allUsers.filter((u) => u.domain?.includes("web")),
      gameDev: allUsers.filter((u) => u.domain?.includes("game")),
      appDev: allUsers.filter((u) => u.domain?.includes("app")),
    };

    res.json({
      success: true,
      points: req.user?.points || 0, // ✅ FIX
      members: groupedMembers,
    });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false });
  }
};

/* ================= USER PROFILE ================= */
export const getUserProfile = async (req, res) => {
  try {
    const requesterId = req.user?._id?.toString() || req.user?.id;
    const targetId = req.params.id;

    if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

    const isAdmin = ["admin", "superadmin"].includes(req.user?.role);
    if (requesterId !== targetId && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await userModel.findById(targetId).populate("badges");
    if (!user) return res.status(404).json({ message: "User not found" });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.verifyOtp;
    delete safeUser.resetOtp;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateUserProfile = async (req, res) => {
  try {
    const requesterId = req.user?._id?.toString() || req.user?.id;
    const targetId = req.params.id;

    if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

    const isAdmin = ["admin", "superadmin"].includes(req.user?.role);
    if (requesterId !== targetId && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedFields = [
      "name",
      "aboutMe",
      "location",
      "branch",
      "year",
      "linkedin",
      "github",
      "domain",
      "profilePicture",
      "password",
    ];

    const setUpdates = {};
    for (const key of allowedFields) {
      const val = req.body[key];
      if (val !== undefined && val !== null && val !== "") {
        setUpdates[key] = val;
      }
    }

    if (setUpdates.password) {
      setUpdates.password = await bcrypt.hash(
        String(setUpdates.password),
        10
      );
    }

    const updated = await userModel
      .findByIdAndUpdate(targetId, { $set: setUpdates }, { new: true })
      .select("-password -verifyOtp -resetOtp");

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ================= TASK SUBMIT ================= */
export const submitUserTask = async (req, res) => {
  try {
    const { taskid, github, demo } = req.body;
    const email = req.user?.email;

    if (!email || !taskid || !github) {
      return res.status(400).json({ success: false });
    }

    const Task = (await import("../models/taskModel.js")).default;
    const taskExists = await Task.findOne({ taskid });
    if (!taskExists)
      return res.status(404).json({ success: false, message: "Task not found" });

    const userTaskModel = (await import("../models/userTask.js")).default;
    let existing = await userTaskModel.findOne({ email, taskid });

    if (existing && existing.status === "approved") {
      return res.status(409).json({ success: false });
    }

    if (existing) {
      existing.github = github;
      existing.demo = demo || "";
      existing.status = "pending";
      await existing.save();
      return res.json({ success: true, userTask: existing });
    }

    const newUT = new userTaskModel({
      email,
      taskid,
      github,
      demo: demo || "",
      status: "pending",
    });

    await newUT.save();
    res.json({ success: true, userTask: newUT });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ================= USER TASK STATUS ================= */
export const getMyUserTasks = async (req, res) => {
  try {
    const email = req.user?.email;
    const userTaskModel = (await import("../models/userTask.js")).default;
    const items = await userTaskModel.find({ email });
    res.json({ success: true, tasks: items });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ================= ALL TASKS FOR USERS ================= */
export const getAllTasksForUsers = async (req, res) => {
  try {
    const Task = (await import("../models/taskModel.js")).default;
    const tasks = await Task.find({}); // ✅ FIX
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ================= LEADERBOARD ================= */
export const getLeaderboard = async (req, res) => {
  try {
    const users = await userModel.find().sort({ points: -1 }).limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
