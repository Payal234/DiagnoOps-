import express from "express";
import {
  registerSuperAdmin,
  loginSuperAdmin,
} from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/register", registerSuperAdmin);
router.post("/login", loginSuperAdmin);

export default router;