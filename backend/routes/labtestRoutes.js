import express from "express";
import {
  getAllTests,
  getTestsByLab,
  getTestById
} from "../controllers/labtestController.js";

const router = express.Router();

router.get("/", getAllTests);

router.get("/lab/:labId", getTestsByLab);

router.get("/:id", getTestById);

export default router;