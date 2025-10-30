import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData,getUserProfile, updateUserProfile, getLeaderboard } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get("/:id", userAuth,getUserProfile);
userRouter.put("/:id", userAuth,updateUserProfile);
userRouter.get("/leaderboard/all",userAuth, getLeaderboard);

export default userRouter;