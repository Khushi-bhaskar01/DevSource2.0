import express from "express";
import { isAuthenticated as userAuth, isSuperAdmin as verifySuperAdmin } from "../middleware/authMiddleware.js";
import { addAdmin, removeAdmin } from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/add-admin",userAuth,  verifySuperAdmin, addAdmin);
router.post("/remove-admin",userAuth, verifySuperAdmin, removeAdmin);

export default router;
