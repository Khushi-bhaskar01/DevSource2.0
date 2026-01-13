import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData,getUserProfile, updateUserProfile, getLeaderboard, submitUserTask, getMyUserTasks, getAllTasksForUsers ,
} from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/tasks-status', userAuth, getMyUserTasks);
userRouter.post('/submit-task', userAuth, submitUserTask);
userRouter.get("/tasks", userAuth, getAllTasksForUsers);
userRouter.get('/leaderboard/all', userAuth, getLeaderboard);
userRouter.get('/:id', userAuth, getUserProfile);
userRouter.put('/:id', userAuth, updateUserProfile);

export default userRouter;
