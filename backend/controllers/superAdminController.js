import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER SUPER ADMIN
export const registerSuperAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Super Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await SuperAdmin.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      superAdmin,
      message: "Super Admin registered successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN SUPER ADMIN
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      superAdmin,
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};