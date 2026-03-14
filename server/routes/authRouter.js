import express from "express";
import {
  isAuthenticated,
} from "../controllers/authController.js";

import { userAuth } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Protected Routes
authRouter.get("/is-auth", isAuthenticated);

export default authRouter;
