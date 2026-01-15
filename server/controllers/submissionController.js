import submissionModel from "../models/submissionModel.js";
import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { taskAssignedTemplate } from "../templates/taskAssigned.js";
import { taskStatusTemplate } from "../templates/taskStatus.js";
import { BADGES } from "../config/badges.js";

// Create a new submission
export const createSubmission = async (req, res, next) => {
  try {
    const { taskId, submissionLink } = req.body;
    const userId = req.user.id;

    if (!taskId || !submissionLink) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔒 CHECK: already submitted?
    const existingSubmission = await submissionModel.findOne({
      taskId,
      userId,
    });

    if (existingSubmission) {
      return res.status(409).json({
        message: "You have already submitted this task",
        status: existingSubmission.status,
      });
    }

    const submission = await submissionModel.create({
      taskId,
      userId,
      submissionLink,
      status: "Pending",
    });

    /* 🔔 Notify admins */
    const user = await userModel.findById(userId);
    const admins = await userModel.find({ role: "admin" });

    for (const admin of admins) {
      await sendEmail(
        admin.email,
        `New Submission: ${task.title}`,
        `
        <h3>New Task Submission</h3>
        <p><b>User:</b> ${user.name} (${user.email})</p>
        <p><b>Task:</b> ${task.title}</p>
        `
      );
    }

    res.status(201).json({
      message: "Submission sent for review",
      submission,
    });
  } catch (error) {
    // Mongo unique index error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Task already submitted",
      });
    }
    next(error);
  }
};


// Admin updates submission status
export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // submission id
    const { status, feedback } = req.body;

    const submission = await submissionModel.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const wasAlreadyApproved = submission.status === "Approved";
    const isNowApproved = status === "Approved";

    submission.status = status;
    submission.feedback = feedback;

    await submission.save();

    if (isNowApproved && !wasAlreadyApproved) {
      const task = await taskModel.findById(submission.taskId);
      if (task && task.points > 0) {
        await userModel.findByIdAndUpdate(submission.userId, {
          $inc: { points: task.points },
        });
        const earnedBadgeIds = user.badges.map(b => b.badgeId);
        const newBadges = BADGES.filter(
          badge =>
            user.points >= badge.points &&
          !earnedBadgeIds.includes(badge.id)
        );
        if (newBadges.length > 0) {
          await userModel.findByIdAndUpdate(user._id, {
            $push: {
              badges: newBadges.map(b => ({ badgeId: b.id, earnedAt: new Date(), })),
            },
          });
        }
      }
    }

    const updatedSubmission = await submissionModel
      .findById(id)
      .populate("userId", "name email")
      .populate("taskId", "title");

    if (updatedSubmission) {
      const user = updatedSubmission.userId;
      const task = updatedSubmission.taskId;
      const html = taskStatusTemplate(user, task, status, feedback);

      sendEmail(user.email, `Submission Update: ${task.title}`, html);
    }

    res
      .status(200)
      .json({ message: "Status updated", submission: updatedSubmission });
  } catch (error) {
    next(error);
  }
};

// Get submissions for a specific task (for admin)
export const getSubmissionsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const submissions = await submissionModel
      .find({ taskId })
      .populate("userId", "name email");
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

// Get submissions for a specific user

export const getSubmissionsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const submissions = await submissionModel
      .find({ userId })
      .populate("taskId", "title domain points");
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};