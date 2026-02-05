import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true // allows multiple null values
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

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },

    profile_pic: {
      url: String,
      public_id: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // OTP SYSTEM (existing)
    otp: String,
    otpExpiry: Date,

    // FUTURE SAFE EXTENSION
    pendingEmail: String,
    pendingPhone: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
