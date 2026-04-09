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

  userId: String,
  userName: String,
  userEmail: String,
  userContact: String,
  userAge: Number,
  userGender: String,
  userBloodGroup: String,
  userAllergies: String,

  platformFee: Number,
  superAdminAmount: Number,
  adminAmount: Number,
  adminId: String,
  adminAccountId: String,
  superAdminAccountId: String,

  paymentId: String,
  orderId: String,

  paymentStatus: {
    type: String,
    default: "pending",
  },

  // Backward-compat: some older code used `status`
  status: {
    type: String,
    default: "pending",
  },

  bookingStatus: {
    type: String,
    default: "Booked",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);