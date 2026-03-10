import express from "express";
import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name,email,password,address,phone,bloodGroup,gender,age,allergies } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashed,
      address,
      phone,
      bloodGroup,
      gender,
      age,
      allergies
    });

    await patient.save();

    res.json({ message: "Patient registered successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req,res)=>{
  const { email, password } = req.body;

  const user = await Patient.findOne({ email });

  if(!user) return res.status(404).json({message:"User not found"});

  const match = await bcrypt.compare(password,user.password);

  if(!match) return res.status(400).json({message:"Invalid password"});

  res.json({message:"Login success", user});
})

export default router;