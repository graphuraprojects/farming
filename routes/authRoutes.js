import express from "express";
import {
  register,
  verifyOtp,
  login,
  logout
} from "../controllers/authController.js";

const router = express.Router();

// Register a new user (farmer / owner / admin)
// Sends OTP to the provided phone number
router.post("/register", register);

// Verify OTP and activate the user account
// Required before login
router.post("/verify-otp", verifyOtp);

// Login user and generate JWT token
// Token is used to access protected APIs
router.post("/login", login);

// Logout the user from the system
// Client should remove stored JWT token
router.post("/logout", logout);

export default router;
