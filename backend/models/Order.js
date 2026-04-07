import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      adminId: String,
      adminAccountId: String,
    },
  ],
  amount: Number,

  // 🔥 NEW FIELDS
  platformFee: Number,
  superAdminAmount: Number,
  adminAmount: Number,
  adminId: String,
  adminAccountId: String,
  superAdminAccountId: String,

  paymentId: String,
  orderId: String,

  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);