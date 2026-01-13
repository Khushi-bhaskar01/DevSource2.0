import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { taskAssignedTemplate } from "../templates/taskAssigned.js";

export const createTask = async (req, res, next) => {
  try {
    const { domain, title, description, points, deadline } = req.body;
    const task = new taskModel({
      domain,
      title,
      description,
      points,
      deadline,
    });

    //email noti to users
    await task.save();
    const users = await userModel.find({
      domain: task.domain,
      role: "student",
    });

    for (const user of users) {
      const html = taskAssignedTemplate(user, task);
      await sendEmail(user.email, `New Task Assigned: ${task.title}`, html);
    }
    //

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await taskModel.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
