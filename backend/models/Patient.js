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
  allergies: String
});

export default mongoose.model("Patient", patientSchema);