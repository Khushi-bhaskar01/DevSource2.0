import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../templates/emailVerifyTemp.js";
import { PASSWORD_RESET_TEMPLATE } from "../templates/passResetTemp.js";
import CustomError from "../utils/customError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeMail } from "../templates/welcomeMail.js";

const sendTokenCookie = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
      throw new CustomError("User with this email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    sendTokenCookie(user, res);

    // Send welcome email
    const welcomeHtml = welcomeMail(name, email);
    transporter.sendMail(welcomeHtml).catch((err) => {
      console.error(`Welcome Email Error: ${err.message}`);
    });

    return res.status(201).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password"); // Include password
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 401);
    }

    if (email === process.env.SUPER_ADMIN_EMAIL && user.role !== "superadmin") {
      user.role = "superadmin";
      await user.save();
    }

    sendTokenCookie(user, res);
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Logged Out" });
  } catch (error) {
    next(error);
  }
};

export const sendVerifyOtp = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (user.isAccountVerified) {
      return res.json({ success: true, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 90000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const html = EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email
    );
    sendEmail(user.email, "Verify Your Email - DevSource", html);

    return res.status(200).json({ success: true, message: "OTP Sent!" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await userModel.findById(req.user.id);

    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      throw new CustomError("Invalid OTP", 400);
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      throw new CustomError("OTP has expired", 400);
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const isAuthenticated = async (req, res, next) => {
  return res.json({ success: true, userId: req.user.id, role: req.user.role, isAccountVerified: req.user.isAccountVerified });
};

export const sendResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const otp = String(Math.floor(100000 + Math.random() * 90000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const html = PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      email
    );
    sendEmail(user.email, "Password Reset OTP - DevSource", html);

    return res.status(200).json({ success: true, message: "OTP Sent!" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.resetOtp !== otp || user.resetOtp === "") {
      throw new CustomError("Invalid OTP", 400);
    }
    if (user.resetOtpExpireAt < Date.now()) {
      throw new CustomError("OTP has expired", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been changed" });
  } catch (error) {
    next(error);
  }
};
