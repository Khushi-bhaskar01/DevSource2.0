import userModel from "../models/userModel.js";

/* =========================
   AUTH CHECK
========================= */
export const isAuthenticated = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isAccountVerified: true, // Firebase users are usually verified or handled by Firebase
    }
  });
};

/* =========================
   GENERATE TOKEN (LEGACY - NOT USED)
========================= */
// No longer needed as Firebase handles tokens
