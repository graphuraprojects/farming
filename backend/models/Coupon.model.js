import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true
    },

    discount_percent: {
      type: Number,
      required: true
    },

    is_active: {
      type: Boolean,
      default: true
    },

    expiry_date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
