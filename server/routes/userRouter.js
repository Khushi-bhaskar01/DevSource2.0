import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getUserData,
  getUserProfile,
  updateUserProfile,
  getMyUserTasks,
  getPublicUsersData,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.get('/tasks-status', userAuth, getMyUserTasks);
userRouter.get("/data", userAuth, getUserData);
userRouter.get("/:id", userAuth, getUserProfile);
userRouter.put("/:id", userAuth, updateUserProfile);
userRouter.get("/public", getPublicUsersData);


export default userRouter;
