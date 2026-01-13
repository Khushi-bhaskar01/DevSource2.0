import submissionModel from "../models/submissionModel.js";
import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { taskAssignedTemplate } from "../templates/taskAssigned.js";

// Create a new submission
export const createSubmission = async (req, res, next) => {
  try {
    const { taskId, submissionLink } = req.body;
    const userId = req.user.id;

    const task = await taskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const submission = new submissionModel({
      taskId,
      userId,
      submissionLink,
      status: "Submitted",
    });

    await submission.save();

    // Notify admins about new submission
    const users = await userModel.findById(userId);
    const admins = await userModel.find({ role: "admin" });

    for (const admin of admins) {
      const html = `
        <h3>Hi ${admin.name},</h3>
        <p>A new submission has been received for task: <b>${task.title}</b>.</p>
        <p>Submitted by: <b>${users.name} (${users.email})</b></p>
        <p>You can review it on the admin dashboard.</p>
      `;
      sendEmail(admin.email, `New Submission: ${task.title}`, html);
    }
    //

    res.status(201).json({ message: "Submission successful", submission });
  } catch (error) {
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
      }
    }

    const updatedSubmission = await submissionModel
      .findById(id)
      .populate("userId", "name email")
      .populate("taskId", "title");

    if (updatedSubmission) {
      const user = updatedSubmission.userId;
      const task = updatedSubmission.taskId;
      const html = taskAssignedTemplate(user, task, status, feedback);

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
    const { userId } = req.user.id;
    const submissions = await submissionModel
      .find({ userId })
      .populate("taskId", "title domain");
    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};
