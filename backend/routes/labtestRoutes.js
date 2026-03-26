import express from "express";
import {
  getAllTests,
  createTest,
  getTestsByLab,
  getTestById,
  updateTest,
  deleteTest,
} from "../controllers/labtestController.js";

const router = express.Router();

router.get("/", getAllTests);
router.post("/", createTest);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);

router.get("/lab/:labId", getTestsByLab);

router.get("/:id", getTestById);

export default router;