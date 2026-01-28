import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    machine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    start_time: Date,
    end_time: Date,
    total_hours: Number,
    total_amount: Number,

    booking_status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending"
    },

    rejection_reason: {
      type: String,
      default: ""
    },

    decision_at: Date
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
