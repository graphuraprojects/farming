import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    role: {
      type: String,
      enum: ["farmer", "owner", "admin"],
      default: "farmer"
    },

    password_hash: {
      type: String,
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    otp: String,
    otpExpiry: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
