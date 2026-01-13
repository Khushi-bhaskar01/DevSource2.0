import express from "express";
import {
  createSubmission,
  updateSubmissionStatus,
  getSubmissionsByTask,
  getSubmissionsByUser,
} from "../controllers/submissionController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student submits task
router.post("/", isAuthenticated, createSubmission);

// Admin updates status
router.put("/:id/status", isAuthenticated, isAdmin, updateSubmissionStatus);

// Get submissions by task or user
router.get("/task/:taskId", isAuthenticated, isAdmin, getSubmissionsByTask);
router.get("/submissions", isAuthenticated, getSubmissionsByUser);

export default router;
