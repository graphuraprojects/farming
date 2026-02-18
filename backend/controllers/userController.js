import User from "../models/User.model.js";
import cloudinary from "../configs/cloudinary.js";
import { sendEmail } from "../configs/sendEmail.js";

// create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password_hash, phone } = req.body;

    // Check existing user
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password_hash,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// get user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password_hash -otp -otpExpiry",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ ADD THIS - Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// get partcular user by id (for admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password_hash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// get All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password_hash");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// delete user (for admin)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile image
    if (user.profile_pic?.public_id) {
      await cloudinary.uploader.destroy(user.profile_pic.public_id);
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
/** UPDATE PROFILE (Cloudinary) */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle profile image
    if (req.file) {
      if (user.profile_pic?.public_id) {
        await cloudinary.uploader.destroy(user.profile_pic.public_id);
      }

      user.profile_pic = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses, // ✅ FIXED
        profile_pic: user.profile_pic,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Block user (admin only)
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    user.isBlocked = true;
    await user.save();

    // Send block notification email
    if (user.email) {
      const blockEmailHtml = `
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
                    <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 48px;">🚫</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Account Suspended</h1>
                      <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px;">Your AgriRent account has been temporarily blocked</p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Dear <strong>${user.name}</strong>,</p>
                      
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">We regret to inform you that your AgriRent account has been temporarily suspended by our administration team.</p>

                      <!-- User Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; margin: 30px 0; border: 1px solid #fecaca;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 18px;">Account Information</h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 14px; width: 30%;">User ID:</td>
                                <td style="color: #333; font-size: 13px; font-family: monospace; font-weight: 600;">${user._id}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Email:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${user.email}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Role:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600; text-transform: capitalize;">${user.role}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Reasons -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600; font-size: 14px;">⚠️ Possible Reasons:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px; line-height: 1.6;">
                          <li>Multiple machine approval rejections</li>
                          <li>Submission of fake documents</li>
                          <li>Violation of platform terms</li>
                          <li>Suspicious activity or spam</li>
                          <li>Payment fraud</li>
                        </ul>
                      </div>

                      <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">During suspension, you cannot:</p>
                      <ul style="margin: 0 0 20px 20px; color: #666; font-size: 15px; line-height: 1.8;">
                        <li>Access your dashboard</li>
                        <li>Manage machine listings</li>
                        <li>Make or accept bookings</li>
                        <li>Process payments</li>
                      </ul>

                      <!-- CTA -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/contact" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Contact Support</a>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;"><strong>⚠️ Important:</strong> Repeated violations may result in permanent account termination.</p>
                      </div>

                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">Best regards,<br><strong style="color: #dc2626;">The AgriRent Team</strong></p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #fef2f2; padding: 25px 30px; text-align: center; border-top: 1px solid #fecaca;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">Need help? <a href="mailto:support@agrirent.com" style="color: #dc2626; text-decoration: none;">support@agrirent.com</a></p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">© 2026 AgriRent. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      console.log("📧 Sending block email to:", user.email);

      const emailSent = await sendEmail({
        to: user.email,
        subject: "⚠️ Account Suspended - Action Required",
        html: blockEmailHtml,
      });

      if (emailSent) {
        console.log("✅ Block notification email sent successfully");
      } else {
        console.log("⚠️ Block email failed to send");
      }
    }

    res.status(200).json({
      success: true,
      message: "User blocked successfully. Notification email sent.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("❌ Block user error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Unblock user (admin only)
export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;
    await user.save();

    // Send unblock notification email
    if (user.email) {
      const unblockEmailHtml = `
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
                        <span style="font-size: 48px;">✅</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Account Restored!</h1>
                      <p style="margin: 10px 0 0 0; color: #e6f7ed; font-size: 16px;">Welcome back to AgriRent</p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Dear <strong>${user.name}</strong>,</p>
                      
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Great news! Your AgriRent account has been successfully <strong style="color: #03a74f;">unblocked</strong> and restored to full access.</p>

                      <!-- Success Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">✓ Account Information</h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 14px; width: 30%;">User ID:</td>
                                <td style="color: #333; font-size: 13px; font-family: monospace; font-weight: 600;">${user._id}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Email:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${user.email}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Status:</td>
                                <td style="color: #03a74f; font-size: 14px; font-weight: 700;">ACTIVE ✓</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">You now have full access to all platform features:</p>
                      <ul style="margin: 0 0 20px 20px; color: #15803d; font-size: 15px; line-height: 1.8;">
                        <li>Access your dashboard</li>
                        <li>Create and manage machine listings</li>
                        <li>Make and accept bookings</li>
                        <li>Process payments</li>
                      </ul>

                      <!-- CTA -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/${user.role === "owner" ? "owner-dashboard" : "farmer-dashboard"}" style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Access Dashboard</a>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #856404; font-weight: 600; font-size: 14px;">📌 Please Remember:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                          <li>Always provide accurate information</li>
                          <li>Upload genuine documents</li>
                          <li>Follow all platform terms</li>
                          <li>Maintain respectful communication</li>
                        </ul>
                      </div>

                      <div style="background-color: #e0f2fe; border: 1px solid #7dd3fc; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #0c4a6e; font-size: 13px; line-height: 1.6;"><strong>💡 Tip:</strong> Future violations may result in permanent account termination. Please ensure you comply with all platform guidelines.</p>
                      </div>

                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">Thank you for your patience and cooperation!</p>
                      <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">Best regards,<br><strong style="color: #03a74f;">The AgriRent Team</strong></p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f0fdf4; padding: 25px 30px; text-align: center; border-top: 1px solid #86efac;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">Questions? <a href="mailto:support@agrirent.com" style="color: #03a74f; text-decoration: none;">support@agrirent.com</a></p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">© 2026 AgriRent. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      console.log("📧 Sending unblock email to:", user.email);

      const emailSent = await sendEmail({
        to: user.email,
        subject: "✅ Account Restored - Welcome Back to AgriRent!",
        html: unblockEmailHtml,
      });

      if (emailSent) {
        console.log("✅ Unblock notification email sent successfully");
      } else {
        console.log("⚠️ Unblock email failed to send");
      }
    }

    res.status(200).json({
      success: true,
      message: "User unblocked successfully. Notification email sent.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("❌ Unblock user error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// // add user address
// export const updateUserAddress = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const { street, city, state, zip, country, latitude, longitude } = req.body;

//     // Basic validation
//     if (!city || !state || !country) {
//       return res.status(400).json({
//         success: false,
//         message: "Street, city, state and country are required",
//       });
//     }

//     // Validate coordinates (if provided)
//     if (
//       latitude !== undefined &&
//       (isNaN(latitude) || latitude < -90 || latitude > 90)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid latitude value",
//       });
//     }

//     if (
//       longitude !== undefined &&
//       (isNaN(longitude) || longitude < -180 || longitude > 180)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid longitude value",
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         address: {
//           street,
//           city,
//           state,
//           zip,
//           country,
//         },
//         location: {
//           latitude: latitude || null,
//           longitude: longitude || null,
//         },
//       },
//       { new: true, runValidators: true },
//     ).select("-password_hash");

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Address and location updated successfully",
//       data: {
//         address: updatedUser.address,
//         location: updatedUser.location,
//       },
//     });
//   } catch (error) {
//     console.error("Update Address Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating address",
//       error: error.message,
//     });
//   }
// };
// // get user address
// export const getUserAddress = async (req, res) => {
//   try {
//     const userId = req.user.userId; // ⭐ FIXED

//     const user = await User.findById(userId).select("address");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user.address || {},
//     });
//   } catch (error) {
//     console.error("Get Address Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching address",
//     });
//   }
// };
// Add a new address
export const addAddress = async (req, res) => {
  try {
    console.log("📥 Incoming addAddress request");
    console.log("👤 User ID:", req.user.userId);
    console.log("📦 Request Body:", req.body);

    const userId = req.user.userId;
    const {
      label,
      street,
      city,
      state,
      zip,
      country,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    const user = await User.findById(userId);

    console.log("👤 Found User:", !!user);
    console.log("📍 Existing Addresses:", user?.addresses);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isDefault || user.addresses.length === 0) {
      console.log("⭐ Setting as default address");
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      label,
      street,
      city,
      state,
      zip,
      country,
      latitude,
      longitude,
      isDefault: isDefault || user.addresses.length === 0,
    });

    console.log("📌 Addresses Before Save:", user.addresses);

    await user.save();

    console.log("✅ Address Saved Successfully");
    console.log("📌 Updated Addresses:", user.addresses);

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  } catch (error) {
    console.error("❌ Add Address Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// Get all addresses
export const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    console.log("📥 Incoming updateAddress request");
    console.log("👤 User ID:", req.user.userId);
    console.log("🆔 Address ID:", req.params.addressId);
    console.log("📦 Request Body:", req.body);

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // ✅ ADD THIS HERE
    const { label, street, city, state, zip, country, latitude, longitude } =
      req.body;

    // ✅ Update fields safely
    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zip !== undefined) address.zip = zip;
    if (country !== undefined) address.country = country;
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;

    console.log("📝 Updated Address Before Save:", address);

    await user.save();

    console.log("✅ Address Updated Successfully");

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  } catch (error) {
    console.error("❌ Update Address Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach((addr) => (addr.isDefault = false));
    address.isDefault = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get default address
export const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const defaultAddress = user.getDefaultAddress();

    res.status(200).json({
      success: true,
      data: defaultAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
