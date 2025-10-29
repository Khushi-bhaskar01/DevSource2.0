import express from "express";
import { addTask, approveTask, getTasksByDomain, rejectTask, removeTask } from "../controllers/adminController.js";
const adminRouter=express.Router();


adminRouter.post('/add-task',addTask);
adminRouter.post('/remove-task',removeTask);
adminRouter.post('/get-tasks',getTasksByDomain);
adminRouter.post('/approve-task',approveTask);
adminRouter.post('/reject-task',rejectTask);

export default adminRouter;