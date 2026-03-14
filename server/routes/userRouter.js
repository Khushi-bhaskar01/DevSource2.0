import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import {
  getUserData,
  getUserProfile,
  updateUserProfile,
  getMyUserTasks,
  getPublicUsersData,
} from "../controllers/userController.js";

const userRouter = express.Router();

// PUBLIC routes (MUST move above dynamic /:id)
userRouter.get("/public", getPublicUsersData);

// PROTECTED routes
userRouter.get('/tasks-status', userAuth, getMyUserTasks);
userRouter.get("/data", userAuth, getUserData);
userRouter.get("/:id", userAuth, getUserProfile);
userRouter.put("/:id", userAuth, updateUserProfile);

export default userRouter;
