import express from "express";
import mongoose from "mongoose";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../models/validationSchema.js";

const router = express.Router();

//Create a new task (Admin only ideally)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validate(createTaskSchema),
  createTask
);

//Get all tasks
router.get("/", isAuthenticated, isAdmin, getAllTasks);

//Get task by ID
router.get("/:id", isAuthenticated, isAdmin, getTaskById);

//Update a task (Admin)
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validate(updateTaskSchema),
  updateTask
);

//Delete a task (Admin)
router.delete("/:id", isAuthenticated, isAdmin, deleteTask);

export default router;
