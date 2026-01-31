import express from "express";
import {
  register,
  verifyOtp,
  login,
  logout
} from "../controllers/authController.js";


const router = express.Router();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and send OTP to email
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and activate user account
 * @access  Public
 */
router.post("/verify-otp", verifyOtp);
/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT / session
 * @access  Public
 */
router.post("/login", login);
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear auth session/token
 * @access  Private
 */
router.post("/logout", logout);



export default router;
