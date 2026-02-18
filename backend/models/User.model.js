import mongoose from "mongoose";

/* ---------------- ADDRESS SUB-SCHEMA ---------------- */

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    zip: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

/* ---------------- USER SCHEMA ---------------- */

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

    // ✅ MUST MATCH CONTROLLERS
    addresses: {
      type: [addressSchema],
      default: [],
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

/* ---------------- METHODS ---------------- */

userSchema.methods.getDefaultAddress = function () {
  return this.addresses.find((addr) => addr.isDefault) || null;
};

export default mongoose.model("User", userSchema);
