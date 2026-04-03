import express from "express";
import UserProfile from "../models/UserProfile.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone, bloodGroup, gender, age, allergies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await UserProfile.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new UserProfile({
      name,
      email,
      password: hashed,
      address,
      phone,
      bloodGroup,
      gender,
      age,
      allergies,
    });

    await user.save();

    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserProfile.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      bloodGroup: user.bloodGroup,
      gender: user.gender,
      age: user.age,
      allergies: user.allergies,
    };

    res.json({ message: "Login success", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await UserProfile.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch profile", error: err.message });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = await UserProfile.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
});

export default router;