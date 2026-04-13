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
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/earnings/admin/:adminId", getAdminEarnings);
router.get("/earnings/superadmin", getSuperAdminEarnings);
router.get("/orders/admin/me", verifyToken, getOrdersForLabAdminMe);
router.get("/orders/admin/:adminId", getOrdersByAdmin);
router.get("/orders/user/:userId", getOrdersByUser);
router.put("/orders/:orderId/status", verifyToken, updateOrderStatus);

export default router;