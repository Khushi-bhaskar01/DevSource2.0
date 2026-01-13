import express from "express";
import { getPublicProfile } from "../controllers/userController.js";

const router = express.Router();

// Public profile: no authentication required
router.get("/:id", getPublicProfile);

export default router;
