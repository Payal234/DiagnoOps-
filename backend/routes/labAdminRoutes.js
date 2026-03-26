import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken, verifySuperAdmin } from "../middleware/auth.js";
import {
  registerLabAdmin,
  loginLabAdmin,
  getLabAdminMe,
  updateLabAdminMe,
  getPublicLabs,
  getPublicLabByName,
  getAllLabAdmins,
  updateLabAdminStatus
} from "../controllers/labAdminController.js";

const router = express.Router();

router.post("/register", upload.single("licenseFile"), registerLabAdmin);
router.post("/login", loginLabAdmin);

// Public endpoints (customer-facing UI)
router.get("/public", getPublicLabs);
router.get("/public/:labName", getPublicLabByName);

router.get("/me", verifyToken, getLabAdminMe);
router.put(
  "/me",
  verifyToken,
  upload.fields([
    { name: "labPhoto", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
  ]),
  updateLabAdminMe
);

router.get("/all", verifyToken, verifySuperAdmin, getAllLabAdmins);
router.put("/status/:id", verifyToken, verifySuperAdmin, updateLabAdminStatus);

export default router;