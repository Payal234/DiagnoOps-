import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  phone: String,
  bloodGroup: String,
  gender: String,
  age: Number,
  allergies: String,
  labAdminId: String, // Link to which lab this patient belongs to
  orderId: String,    // Reference to the order

  // Snapshot of the latest booking so DB shows which tests were booked
  lastBooking: {
    dbOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    orderId: String,
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    paymentStatus: String,
    bookingStatus: String,
    bookedAt: Date,
  },
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);