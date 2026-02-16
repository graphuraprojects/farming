import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    machine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    start_time: Date,
    end_time: Date,
    total_hours: Number,
    total_amount: Number,

    transport_fee: {
      type: Number,
      default: 0,
    },

    rent_amount: {
      type: Number,
      default: 0,
    },

    booking_status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
        "confirmed",
      ],
      default: "pending",
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    rejection_reason: {
      type: String,
      default: "",
    },

    decision_at: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
