import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/*
 * Checks if the user is logged in.
 * 1. Grabs the 'token' from the cookie.
 * 2. Verifies the token.
 * 3. Finds the user from the token's ID.
 * 4. Attaches the user data to 'req.user' for the next function.
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login first to access this resource.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 'req.user' will be used by the next middleware (isAdmin)
    req.user = await userModel.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Checks if the user's role is 'admin' or 'superadmin'.
 * This middleware MUST run *after* isAuthenticated.
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    next(); // User has the correct role, proceed.
  } else {
    return res.status(403).json({
      success: false,
      message: `Role (${req.user.role}) is not authorized to access this resource.`,
    });
  }
};
