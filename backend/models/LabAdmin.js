import mongoose from "mongoose";

const labAdminSchema = new mongoose.Schema(
  {
    ownerName: String,
    email: String,
    password: String,
    mobile: String,
    labName: String,
    licenseNumber: String,
    experience: Number,
    openingDay: String,
    openingTime: String,
    closingTime: String,
    address: String,
    licenseFile: String,
    labPhoto: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LabAdmin", labAdminSchema);