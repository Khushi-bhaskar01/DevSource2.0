import userModel from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";

export const addAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Check if requester is the Super Admin
    //    Or, keep your email check:
    if (req.user.role !== "superadmin") {
      throw new CustomError("Access denied. Not a Super Admin.", 403);
    }

    // 2. Find the user to promote
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new CustomError("User not found with this email", 404);
    }

    // 3. Check if they are already an admin or superadmin
    if (user.role === "admin" || user.role === "superadmin") {
      throw new CustomError("User is already an admin", 400);
    }

    // 4. Promote to "admin"
    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: `${user.name} (${email}) has been promoted to admin.`,
    });
  } catch (error) {
    next(error);
  }
};

export const removeAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Check if requester is the Super Admin
    if (req.user.role !== "superadmin") {
      throw new CustomError("Access denied. Not a Super Admin.", 403);
    }

    // 2. Prevent self-demotion (using email check is still safest here)
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      throw new CustomError("Cannot remove the Super Admin.", 400);
    }

    // 3. Find the user to demote
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new CustomError("User not found with this email", 404);
    }

    // 4. Check if they are not an admin
    if (user.role !== "admin") {
      throw new CustomError("User is not an admin.", 400);
    }

    // 5. Demote to "student"
    user.role = "student";
    await user.save();

    res.json({
      success: true,
      message: `${user.name} (${email}) has been demoted to student.`,
    });
  } catch (error) {
    next(error);
  }
};
