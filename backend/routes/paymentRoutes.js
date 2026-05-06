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

// Multer error handler wrapper
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    console.error("Upload error:", err);
    return res.status(400).json({ error: err.message || "File upload failed" });
  }
  next();
};

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/earnings/admin/:adminId", getAdminEarnings);
router.get("/earnings/superadmin", getSuperAdminEarnings);
router.get("/orders/admin/me", verifyToken, getOrdersForLabAdminMe);
router.get("/orders/admin/:adminId", getOrdersByAdmin);
router.get("/orders/user/:userId", getOrdersByUser);
router.put("/orders/:orderId/status", verifyToken, updateOrderStatus);
router.put(
  "/orders/:orderId/report",
  verifyToken,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => handleUploadErrors(err, req, res, next));
  },
  uploadReport
);

export default router;