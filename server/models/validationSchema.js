import Joi from "joi";

// Schema for creating a task
export const createTaskSchema = Joi.object({
  domain: Joi.string().required(),
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("").max(1000),
  points: Joi.number().min(0).required(),
  deadline: Joi.string().required(),
});

// Schema for updating a task
export const updateTaskSchema = Joi.object({
  domain: Joi.string().required(),
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("").max(1000),
  points: Joi.number().min(0).required(),
  deadline: Joi.string().required(),
});

// Schema for submitting a task
export const createSubmissionSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required(),
  submissionLink: Joi.string().uri().required(),
});

// Schema for updating a submission's status
export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("Approved", "Rejected").required(),
  feedback: Joi.string().allow("").max(1000),
});

// Schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

// Schema for user login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schema for verifying an OTP
export const otpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
});

// Schema for sending a reset OTP (just need email)
export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Schema for resetting the password
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).max(50).required(),
});
