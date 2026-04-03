import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: String,
  phone: String,
  bloodGroup: String,
  gender: String,
  age: Number,
  allergies: String,
});

export default mongoose.model("UserProfile", userProfileSchema);
