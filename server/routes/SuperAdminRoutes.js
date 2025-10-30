import express from "express";
import userAuth from "../middleware/userAuth.js";
import { verifySuperAdmin } from "../middleware/VerifysuperAdmin.js";
import { addAdmin, removeAdmin } from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/add-admin",userAuth,  verifySuperAdmin, addAdmin);
router.post("/remove-admin",userAuth, verifySuperAdmin, removeAdmin);

export default router;
