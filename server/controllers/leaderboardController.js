import userModel from "../models/userModel.js";
import customError from "../utils/customError.js";

export const getLeaderboard = async (req, res, next) => {
  try {
    const topLimit = 10;
    const leaderboard = await userModel
      .find({ role: "student" }) //check user or student role
      .sort({ points: -1 })
      .limit(topLimit)
      .select("name points branch year profilePicture");

    if (!leaderboard) {
      throw new customError("Leaderboard data not found", 404);
    }

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};
