import mongoose from "mongoose";
import taskModel from "../models/taskModel.js";
import userTaskModel from "../models/userTask.js";
import userModel from "../models/userModel.js";

/* ================= ADD TASK ================= */

export const addTask = async (req, res) => {
  const { domain, title, description, points } = req.body;

  if (!domain || !title || points === undefined) {
    return res.status(400).json({
      success: false,
      message: "Domain, title and points are required",
    });
  }

  if (!["web", "app", "game"].includes(domain)) {
    return res.status(400).json({
      success: false,
      message: "Invalid domain",
    });
  }

  try {
    const newTask = new taskModel({
      domain,
      title,
      description,
      points: Number(points),
      taskid: new mongoose.Types.ObjectId().toString(), // frontend-safe ID
    });

    await newTask.save();

    res.json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= REMOVE TASK ================= */

export const removeTask = async (req, res) => {
  const { taskid } = req.body;

  if (!taskid) {
    return res.status(400).json({ success: false, message: "Task ID required" });
  }

  try {
    const deleted = await taskModel.findOneAndDelete({ taskid });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Remove all user submissions for this task
    await userTaskModel.deleteMany({ taskid });

    res.json({ success: true, message: "Task removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET TASKS BY DOMAIN ================= */

export const getTasksByDomain = async (req, res) => {
  const { domain } = req.body;

  if (!["web", "app", "game"].includes(domain)) {
    return res.status(400).json({ success: false, message: "Invalid domain" });
  }

  try {
    const tasks = await taskModel.find({ domain }).sort({ points: 1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= APPROVE TASK ================= */

export const approveTask = async (req, res) => {
  const { email, taskid } = req.body;

  if (!email || !taskid) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const userTask = await userTaskModel.findOne({ email, taskid });
    if (!userTask) {
      return res.status(400).json({
        success: false,
        message: "Task not submitted by user",
      });
    }

    if (userTask.status === "approved") {
      return res.json({ success: true, message: "Already approved" });
    }

    const task = await taskModel.findOne({ taskid });
    const user = await userModel.findOne({ email });

    if (!task || !user) {
      return res.status(404).json({ success: false });
    }

    userTask.status = "approved";
    await userTask.save();

    const prevPoints = user.points || 0;
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $inc: { points: task.points } },
      { new: true }
    );

    /* ===== BADGES ===== */
    const thresholds = [
      { limit: 100, badgeId: "Beginner" },
      { limit: 200, badgeId: "Intermediate" },
      { limit: 400, badgeId: "Advanced" },
    ];

    for (const b of thresholds) {
      if (prevPoints < b.limit && updatedUser.points >= b.limit) {
        const has = updatedUser.badges.some((x) => x.badgeId === b.badgeId);
        if (!has) {
          await userModel.updateOne(
            { email },
            { $push: { badges: { badgeId: b.badgeId, earnedAt: new Date() } } }
          );
        }
      }
    }

    res.json({ success: true, userTask, user: updatedUser });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/* ================= REJECT TASK ================= */

export const rejectTask = async (req, res) => {
  const { email, taskid } = req.body;

  if (!email || !taskid) {
    return res.status(400).json({
      success: false,
      message: "Missing email or taskid",
    });
  }

  try {
    const updated = await userTaskModel.findOneAndUpdate(
      { email, taskid },
      { status: "rejected" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User task not found",
      });
    }

    res.json({ success: true, userTask: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

