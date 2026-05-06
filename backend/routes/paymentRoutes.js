import express from "express";
import {
  createOrder,
  verifyPayment,
  getAdminEarnings,
  getSuperAdminEarnings,
  getOrdersByAdmin,
  getOrdersByUser,
  updateOrderStatus,
  getOrdersForLabAdminMe,
  uploadReport,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/earnings/admin/:adminId", getAdminEarnings);
router.get("/earnings/superadmin", getSuperAdminEarnings);
router.get("/orders/admin/me", verifyToken, getOrdersForLabAdminMe);
router.get("/orders/admin/:adminId", getOrdersByAdmin);
router.get("/orders/user/:userId", getOrdersByUser);
router.put("/orders/:orderId/status", verifyToken, updateOrderStatus);
router.put("/orders/:orderId/report", verifyToken, upload.single("file"), uploadReport);

export default router;