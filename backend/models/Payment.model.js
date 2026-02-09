import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    total_amount: {
      type: Number,
      required: true,
    },

    admin_commission: {
      type: Number,
      required: true,
    },

    owner_amount: {
      type: Number,
      required: true,
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    payment_method: {
      type: String,
      default: "online",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
