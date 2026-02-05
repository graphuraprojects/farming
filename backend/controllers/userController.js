import User from "../models/User.model.js";
import cloudinary from "../configs/cloudinary.js";

/**
 * UPDATE PROFILE (Cloudinary)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update basic fields
    if (name) user.name = name;
    if (address) user.address = address;

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
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};
