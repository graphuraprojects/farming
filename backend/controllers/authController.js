import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { sendEmail } from "../configs/sendEmail.js";

// Temporary storage for unverified users (expires in 15 minutes)
const pendingUsers = new Map();

// Clean up expired pending users every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [email, data] of pendingUsers.entries()) {
      if (data.otpExpiry < now) {
        pendingUsers.delete(email);
      }
    }
  },
  5 * 60 * 1000,
);

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * REGISTER - Store user temporarily, send OTP
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3️⃣ Hash password & generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 4️⃣ Store in temporary storage (NOT database yet)
    pendingUsers.set(email, {
      name,
      email,
      phone,
      role,
      password_hash: hashedPassword,
      otp,
      otpExpiry,
    });

    // 5️⃣ Send OTP email
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your email - Farming App",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    if (!emailSent) {
      pendingUsers.delete(email);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    // 6️⃣ Response
    res.status(201).json({
      success: true,
      message: "OTP sent to email",
      data: {
        email,
        name,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * VERIFY OTP - Create user in database only after verification
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 2️⃣ Get pending user
    const pendingUser = pendingUsers.get(email);

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    // 3️⃣ Check OTP expiry
    if (pendingUser.otpExpiry < Date.now()) {
      pendingUsers.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }

    // 4️⃣ Verify OTP
    if (pendingUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 5️⃣ NOW create user in database
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone,
      role: pendingUser.role,
      password_hash: pendingUser.password_hash,
      isVerified: true,
    });

    // 6️⃣ Remove from pending storage
    pendingUsers.delete(email);

    // 7️⃣ Generate token and log them in immediately
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

/**
 * RESEND OTP
 */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const pendingUser = pendingUsers.get(email);

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    // Update pending user
    pendingUser.otp = otp;
    pendingUser.otpExpiry = otpExpiry;
    pendingUsers.set(email, pendingUser);

    // Send new OTP
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your email - Farming App",
      html: `
        <h2>Email Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

// Keep LOGIN and LOGOUT as they were
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
