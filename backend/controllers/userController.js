import User from "../models/User.model.js";
import cloudinary from "../configs/cloudinary.js";


// create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password_hash, phone } = req.body;

    // Check existing user
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email,
      password_hash,
      phone
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// get user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password_hash -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// get partcular user by id (for admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password_hash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// get All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password_hash");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
        message: "User not found"
      });
    }

    // Delete profile image
    if (user.profile_pic?.public_id) {
      await cloudinary.uploader.destroy(
        user.profile_pic.public_id
      );
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * UPDATE PROFILE (Cloudinary)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, address, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle address - it comes as a JSON string from FormData
    if (address) {
      try {
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        user.address = {
          street: parsedAddress.street || user.address?.street || "",
          city: parsedAddress.city || user.address?.city || "",
          state: parsedAddress.state || user.address?.state || "",
          zip: parsedAddress.zip || user.address?.zip || "",
          country: parsedAddress.country || user.address?.country || "",
        };
      } catch (parseError) {
        console.error("Error parsing address:", parseError);
        return res.status(400).json({
          success: false,
          message: "Invalid address format",
          error: parseError.message
        });
      }
    }

    // Handle profile image
    if (req.file) {
      // Delete old image from Cloudinary (if exists)
      if (user.profile_pic?.public_id) {
        await cloudinary.uploader.destroy(
          user.profile_pic.public_id
        );
      }

      user.profile_pic = {
        url: req.file.path,
        public_id: req.file.filename
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
        address: user.address,
        profile_pic: user.profile_pic
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};