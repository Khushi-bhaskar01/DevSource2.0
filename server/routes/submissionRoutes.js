import express from "express";
import {
  createSubmission,
  updateSubmissionStatus,
  getSubmissionsByTask,
  getSubmissionsByUser,
  getAllSubmissions,
} from "../controllers/submissionController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student submits task
router.post("/", isAuthenticated, createSubmission);

// Admin gets ALL submissions - ADD THIS BEFORE /:id routes!
router.get("/", isAuthenticated, isAdmin, getAllSubmissions);

// Get user's own submissions
router.get("/my", isAuthenticated, getSubmissionsByUser);

// Get submissions by task
router.get("/task/:taskId", isAuthenticated, isAdmin, getSubmissionsByTask);

// Admin updates status - CHANGE FROM /:id/status TO /:id
router.put("/:id", isAuthenticated, isAdmin, updateSubmissionStatus);

export default router;