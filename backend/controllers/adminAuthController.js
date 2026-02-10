import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    console.log("\n=========== ADMIN REGISTER REQUEST START ===========");

    console.log("Incoming Request Body:", req.body);

    const { name, email, password, secretKey } = req.body;

    console.log("Extracted Fields:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password Provided:", password ? "YES" : "NO");
    console.log("Secret Key Provided:", secretKey ? "YES" : "NO");

    // ⭐ SECRET KEY CHECK
    console.log("Checking Admin Secret Key...");
    console.log("Expected Secret Key:", process.env.ADMIN_SECRET_KEY);

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      console.log("❌ Secret Key Mismatch");

      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key",
      });
    }

    console.log("✅ Secret Key Verified");

    // ⭐ CHECK EXISTING ADMIN
    console.log("Checking if admin already exists...");
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("❌ Admin already exists with email:", email);

      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    console.log("✅ No existing admin found");

    // ⭐ PASSWORD HASHING
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // ⭐ CREATE ADMIN
    console.log("Creating Admin User in DB...");

    const admin = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("✅ Admin Created:", admin._id);

    // ⭐ JWT TOKEN CREATION
    console.log("Generating JWT Token...");

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("✅ Token Generated");

    console.log("=========== ADMIN REGISTER SUCCESS ===========\n");

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin,
    });
  } catch (error) {
    console.log("\n🚨 ADMIN REGISTER ERROR OCCURRED 🚨");
    console.error(error);
    console.log("================================================\n");

    res.status(500).json({
      success: false,
      message: "Admin registration failed",
      error: error.message,
    });
  }
};
