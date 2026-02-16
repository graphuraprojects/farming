import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["farmer", "owner", "admin"],
      default: "farmer",
    },

    password_hash: {
      type: String,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    profile_pic: {
      url: String,
      public_id: String,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    pendingEmail: String,
    pendingPhone: String,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
