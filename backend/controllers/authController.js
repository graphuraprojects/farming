import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { sendEmail } from "../configs/sendEmail.js";

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      role,
      password_hash: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000
    });

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
      data: { userId: user._id, name: user.name, email: user.email , role: user.role,otp: user.otp}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

/**
 * VERIFY OTP
 */
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // 1️⃣ Validate input
    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "UserId and OTP are required"
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3️⃣ Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 4️⃣ Match OTP (string comparison)
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 5️⃣ Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message
    });
  }
};


/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout successful"
  });
};
