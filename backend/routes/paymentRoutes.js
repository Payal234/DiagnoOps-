import express from "express";
import {
  createOrder,
  verifyPayment,
  getAdminEarnings,
  getSuperAdminEarnings,
  getOrdersByAdmin,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/earnings/admin/:adminId", getAdminEarnings);
router.get("/earnings/superadmin", getSuperAdminEarnings);
router.get("/orders/admin/:adminId", getOrdersByAdmin);
router.get("/orders/user/:userId", getOrdersByUser);
router.put("/orders/:orderId/status", updateOrderStatus);

export default router;