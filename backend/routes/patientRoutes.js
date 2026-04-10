import express from "express";
import {
  getAllPatients,
  getPatientById,
  registerPatient,
  updatePatient,
  deletePatient,
  getPatientsByLab
} from "../controllers/patientController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerPatient);
router.get("/", getAllPatients); // Get all patients - for admin

// Public: Get patients by specific lab (must be before /:id route)
router.get("/by-lab/:labAdminId", getPatientsByLab);

// Protected routes (require authentication)
router.get("/:id", verifyToken, getPatientById);
router.put("/:id", verifyToken, updatePatient);
router.delete("/:id", verifyToken, deletePatient);

export default router;
