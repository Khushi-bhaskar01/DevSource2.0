import admin from "../config/firebaseAdmin.js";
import userModel from "../models/userModel.js";

/**
 * Checks if the user is logged in using Firebase ID Token.
 * Populates req.user.
 */
export const isAuthenticated = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No authentication token provided.",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await userModel.findOne({ firebaseUID: uid });

    if (!user) {
      // Check by email to bridge legacy accounts or new social logins
      user = await userModel.findOne({ email });
      if (user) {
        user.firebaseUID = uid;
        // Elevate roles based on email or previous state
        if (email === process.env.SUPER_ADMIN_EMAIL) {
          user.role = 'superadmin';
        } else if (user.role === 'user') {
          user.role = 'student';
        }
        await user.save();
      } else {
        // Create new student identity
        user = await userModel.create({
          firebaseUID: uid,
          name: name || email.split("@")[0],
          email: email,
          profilePicture: picture || "",
          role: email === process.env.SUPER_ADMIN_EMAIL ? "superadmin" : "student",
        });
      }
    } else if (user.email === process.env.SUPER_ADMIN_EMAIL && user.role !== 'superadmin') {
       // Ensure existing user is elevated if email matches
       user.role = 'superadmin';
       await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Compatibility export for userAuth
 */
export const userAuth = isAuthenticated;

/**
 * Checks if the user's role is 'admin' or 'superadmin'.
 * This middleware MUST run *after* isAuthenticated.
 */
export const isAdmin = (req, res, next) => {
  const role = req.user?.role?.toLowerCase();
  const isElevated = req.user && (
    role === "admin" || 
    role === "superadmin" || 
    req.user.email?.toLowerCase() === process.env.SUPER_ADMIN_EMAIL?.toLowerCase()
  );

  if (isElevated) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: `Role (${req.user?.role}) is not authorized to access this resource.`,
    });
  }
};

/**
 * Checks if the user is a Super Admin based on ENV email.
 */
export const isSuperAdmin = (req, res, next) => {
  const role = req.user?.role?.toLowerCase();
  const isSuper = req.user && (
    role === "superadmin" || 
    req.user.email?.toLowerCase() === process.env.SUPER_ADMIN_EMAIL?.toLowerCase()
  );

  if (isSuper) {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Super Admin access required." });
  }
};
