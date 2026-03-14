import express from "express";
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken, verifySuperAdmin } from "../middleware/auth.js";

const router = express.Router();

// Super Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, organizationName, phoneNumber } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !organizationName || !phoneNumber) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters" 
      });
    }

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email });
    if (existingSuperAdmin) {
      return res.status(409).json({ 
        message: "Super admin with this email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new super admin
    const superAdmin = new SuperAdmin({
      fullName,
      email,
      password: hashedPassword,
      organizationName,
      phoneNumber
    });

    await superAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: superAdmin._id, 
        email: superAdmin.email, 
        role: 'superadmin' 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Super admin registered successfully",
      token,
      superAdmin: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        organizationName: superAdmin.organizationName,
        phoneNumber: superAdmin.phoneNumber,
        role: superAdmin.role
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Server error during registration",
      error: err.message 
    });
  }
});

// Super Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find super admin by email
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({ 
        message: "Super admin not found" 
      });
    }

    // Check if account is active
    if (!superAdmin.isActive) {
      return res.status(403).json({ 
        message: "Account is deactivated. Please contact support." 
      });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        message: "Invalid password" 
      });
    }

    // Update last login
    superAdmin.lastLogin = new Date();
    await superAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: superAdmin._id, 
        email: superAdmin.email, 
        role: 'superadmin' 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({ 
      message: "Login successful",
      token,
      superAdmin: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        organizationName: superAdmin.organizationName,
        phoneNumber: superAdmin.phoneNumber,
        role: superAdmin.role,
        lastLogin: superAdmin.lastLogin
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      error: err.message 
    });
  }
});

// Get Super Admin Profile (Protected)
router.get("/profile/:id", verifyToken, verifySuperAdmin, async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.params.id).select('-password');
    
    if (!superAdmin) {
      return res.status(404).json({ 
        message: "Super admin not found" 
      });
    }

    res.json({ superAdmin });

  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ 
      message: "Server error fetching profile",
      error: err.message 
    });
  }
});

// Update Super Admin Profile (Protected)
router.put("/profile/:id", verifyToken, verifySuperAdmin, async (req, res) => {
  try {
    const { fullName, organizationName, phoneNumber } = req.body;

    const superAdmin = await SuperAdmin.findById(req.params.id);
    
    if (!superAdmin) {
      return res.status(404).json({ 
        message: "Super admin not found" 
      });
    }

    // Update fields
    if (fullName) superAdmin.fullName = fullName;
    if (organizationName) superAdmin.organizationName = organizationName;
    if (phoneNumber) superAdmin.phoneNumber = phoneNumber;

    await superAdmin.save();

    res.json({ 
      message: "Profile updated successfully",
      superAdmin: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        organizationName: superAdmin.organizationName,
        phoneNumber: superAdmin.phoneNumber,
        role: superAdmin.role
      }
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ 
      message: "Server error updating profile",
      error: err.message 
    });
  }
});

export default router;
