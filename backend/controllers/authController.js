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
      isBlocked: user.isBlocked, // ✅ ADD THIS - Send isBlocked field
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

    // ✅ ADD THIS - Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
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
      isBlocked: user.isBlocked,
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

// Add these new controllers to your existing authController.js

/**
 * FORGOT PASSWORD - Send reset link/OTP
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in temporary storage
    pendingUsers.set(`reset_${email}`, {
      email,
      otp,
      otpExpiry,
    });

    // Send OTP email
    const resetEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 48px;">🔐</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                      Reset Your Password
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">
                      We received a request to reset your password
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${user.name}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      You requested to reset your password for your AgriRent account. Use the OTP below to proceed:
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #03a74f; border-radius: 12px; padding: 30px; display: inline-block;">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                              Your OTP Code
                            </p>
                            <h1 style="margin: 0; color: #03a74f; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </h1>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Validity Info -->
                    <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        ⏰ <strong>This OTP is valid for 10 minutes only.</strong> Please use it soon to reset your password.
                      </p>
                    </div>

                    <!-- Security Notice -->
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: 600; font-size: 14px;">
                        🔒 Security Notice:
                      </p>
                      <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                        If you didn't request a password reset, please ignore this email or contact our support team immediately if you're concerned about your account security.
                      </p>
                    </div>

                    <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best regards,<br>
                      <strong style="color: #03a74f;">The AgriRent Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8faf9; padding: 25px 30px; text-align: center; border-top: 1px solid #e6f7ed;">
                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                      Need help? <a href="mailto:support@agrirent.com" style="color: #03a74f; text-decoration: none;">support@agrirent.com</a>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2026 AgriRent. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject: "🔐 Reset Your Password - AgriRent",
      html: resetEmailHtml,
    });

    if (!emailSent) {
      pendingUsers.delete(`reset_${email}`);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
      data: { email },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
};

/**
 * VERIFY RESET OTP
 */
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const resetData = pendingUsers.get(`reset_${email}`);

    if (!resetData) {
      return res.status(404).json({
        success: false,
        message: "Reset session expired. Please request a new OTP.",
      });
    }

    if (resetData.otpExpiry < Date.now()) {
      pendingUsers.delete(`reset_${email}`);
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (resetData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark OTP as verified (extend expiry for password reset step)
    resetData.verified = true;
    resetData.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 more minutes
    pendingUsers.set(`reset_${email}`, resetData);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const resetData = pendingUsers.get(`reset_${email}`);

    if (!resetData || !resetData.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    if (resetData.otpExpiry < Date.now()) {
      pendingUsers.delete(`reset_${email}`);
      return res.status(400).json({
        success: false,
        message: "Session expired. Please start over.",
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();

    // Clean up
    pendingUsers.delete(`reset_${email}`);

    // Send confirmation email
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #03a74f 0%, #038a42 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 48px;">✓</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                      Password Reset Successful!
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #e6f7ed; font-size: 16px;">
                      Your password has been updated
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${user.name}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Your password has been successfully reset. You can now log in to your AgriRent account using your new password.
                    </p>

                    <!-- Success Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="width: 60px; height: 60px; background-color: #03a74f; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 32px; color: white;">✓</span>
                          </div>
                          <h3 style="margin: 0 0 10px 0; color: #03a74f; font-size: 18px;">
                            Password Updated
                          </h3>
                          <p style="margin: 0; color: #15803d; font-size: 14px;">
                            Your account is now secure with your new password
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Notice -->
                    <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0 0 10px 0; color: #856404; font-weight: 600; font-size: 14px;">
                        🔒 Security Reminder:
                      </p>
                      <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                        <li>If you didn't make this change, contact support immediately</li>
                        <li>Never share your password with anyone</li>
                        <li>Use a strong, unique password for your account</li>
                      </ul>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                            Login to Your Account
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best regards,<br>
                      <strong style="color: #03a74f;">The AgriRent Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f0fdf4; padding: 25px 30px; text-align: center; border-top: 1px solid #86efac;">
                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                      Need help? <a href="mailto:support@agrirent.com" style="color: #03a74f; text-decoration: none;">support@agrirent.com</a>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2026 AgriRent. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "✓ Password Reset Successful - AgriRent",
      html: confirmationEmailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};