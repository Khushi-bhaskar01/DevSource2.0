import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";

import userAuth from "../middleware/userAuth.js";

import { validate } from "../middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  emailSchema,
} from "../models/validationSchema.js";

const authRouter = express.Router();

//Public Routes
authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/send-reset-otp", validate(emailSchema), sendResetOtp);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

//Protected Routes
authRouter.post("/logout", userAuth, logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, validate(otpSchema), verifyEmail);

authRouter.get("/is-auth", userAuth, isAuthenticated);

export default authRouter;
