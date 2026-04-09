import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_Key_SECRET,
});

// 👉 SUPER ADMIN ACCOUNT ID (Razorpay Route)
const SUPER_ADMIN_ACCOUNT_ID = process.env.SUPER_ADMIN_ACCOUNT_ID || "";

// ✅ CREATE ORDER CONTROLLER
export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      items,
      adminId,
      adminAccountId,
      userId,
      userName,
      userEmail,
      userContact,
      userAge,
      userGender,
      userBloodGroup,
      userAllergies,
    } = req.body;

    const platformFee = 10; // 👈 fix or dynamic
    const adminAmount = amount - platformFee;
    const superAdminAmount = platformFee;

    const transfers = [];
    if (adminAccountId) {
      transfers.push({
        account: adminAccountId,
        amount: adminAmount * 100,
        currency: "INR",
        notes: { role: "admin" },
      });
    }

    if (SUPER_ADMIN_ACCOUNT_ID) {
      transfers.push({
        account: SUPER_ADMIN_ACCOUNT_ID,
        amount: platformFee * 100,
        currency: "INR",
        notes: { role: "platform_fee" },
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      ...(transfers.length ? { transfers } : {}),
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save in DB
    const newOrder = await Order.create({
      items,
      amount,
      userId,
      userName,
      userEmail,
      userContact,
      userAge,
      userGender,
      userBloodGroup,
      userAllergies,
      platformFee,
      superAdminAmount,
      adminAmount,
      adminId,
      adminAccountId,
      superAdminAccountId: SUPER_ADMIN_ACCOUNT_ID,
      orderId: order.id,
      bookingStatus: "Booked",
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating order", details: err.message });
  }
};

export const getAdminEarnings = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const earnings = await Order.aggregate([
      {
        $match: {
          adminId,
          $or: [{ paymentStatus: "success" }, { status: "success" }],
        },
      },
      {
        $group: {
          _id: null,
          totalAdminAmount: { $sum: "$adminAmount" },
          totalPlatformFee: { $sum: "$platformFee" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const summary = earnings[0] || {
      totalAdminAmount: 0,
      totalPlatformFee: 0,
      orderCount: 0,
    };

    res.json({ success: true, earnings: summary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch admin earnings", details: err.message });
  }
};

export const getSuperAdminEarnings = async (req, res) => {
  try {
    const earnings = await Order.aggregate([
      { $match: { $or: [{ paymentStatus: "success" }, { status: "success" }] } },
      {
        $group: {
          _id: null,
          totalPlatformFee: { $sum: "$platformFee" },
          totalAmount: { $sum: "$amount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const summary = earnings[0] || {
      totalPlatformFee: 0,
      totalAmount: 0,
      orderCount: 0,
    };

    res.json({ success: true, earnings: summary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch super admin earnings", details: err.message });
  }
};

export const getOrdersByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const orders = await Order.find({
      adminId,
      $or: [{ paymentStatus: "success" }, { status: "success" }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch admin orders", details: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentStatus: "success" }, { status: "success" }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user orders", details: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { bookingStatus } = req.body;

    if (!orderId || !bookingStatus) {
      return res.status(400).json({ error: "orderId and bookingStatus are required" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { bookingStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update order status", details: err.message });
  }
};

// ✅ VERIFY PAYMENT CONTROLLER
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_Key_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      await Order.findByIdAndUpdate(dbOrderId, {
        paymentId: razorpay_payment_id,
        paymentStatus: "success",
        status: "success",
      });

      res.json({ success: true });

    } else {
      res.status(400).json({ success: false });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
};