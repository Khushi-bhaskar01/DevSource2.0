import taskModel from "../models/taskModel.js";
import userTaskModel from "../models/userTask.js";
import mongoose from "mongoose";
export const addTask = async (req, res) => {
    const { domain, title, description, points } = req.body;
    if (!title || !points) {
        return res.json({ success: false, message: "Invalid task name" });
    }
    try {
        const newTask =taskModel({domain,title,description,taskid: new mongoose.Types.ObjectId().toString(),points});
        await newTask.save();
        res.json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ success: false, message:error.message });
    }
}
export const removeTask = async (req,res) => {
    const { taskid } = req.body;
    try {
        const deleted = await taskModel.findOneAndDelete({ taskid });
        if (!deleted) {
            return res.json({ success: false, message: "Invalid task" });
        }
        await userTaskModel.deleteMany({ taskid: taskid });
        res.json({ success: true, message: "Task removed" });
    } catch (error) {
        res.status(500).json({ success: false, message:error.message });
    }
}
export const getTasksByDomain = async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ success: false, message: "Invalid Domain" });
  }

  try {
    const tasks = await taskModel.find({ domain });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message:error.message });
  }
};

export const approveTask = async (req, res) => {
  const { email, taskid } = req.body;
  if (!email || !taskid) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const updated = userTaskModel({ email, taskid,status:'approved',new: true });

    await updated.save();
    if (!updated) {
      return res.status(404).json({ success: false, message: "User-task not found" });
    }

    res.json({ success: true, userTask: updated });
  } catch (error) {
    res.status(500).json({ success: false, message:error.message });
  }
};

export const rejectTask = async (req, res) => {
  const { email, taskid } = req.body;
  if (!email || !taskid) {
    return res.status(400).json({ success: false, message: "Missing email or taskid" });
  }

  try {
    const updated = await userTaskModel.findOneAndUpdate(
      { email, taskid },
      { status: 'rejected' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Invalid user" });
    }

    res.json({ success: true, userTask: updated });
  } catch (error) {
    res.status(500).json({ success: false, message:error.message });
  }
};

