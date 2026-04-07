import express from "express";
import {
  createOrder,
  verifyPayment,
  getAdminEarnings,
  getSuperAdminEarnings,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/earnings/admin/:adminId", getAdminEarnings);
router.get("/earnings/superadmin", getSuperAdminEarnings);

export default router;