import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
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

    otp: {
      type: String
    },

    otpExpiry: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
