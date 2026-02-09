import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        machineName: String,
        model: String,
        ratePerHour: Number,
        hours: Number,
        transportCharge: Number,
        subtotal: Number
      }
    ],

    subtotal: Number,
    platformFee: Number,
    tax: Number,
    totalAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING"],
      default: "PAID"
    },

    paymentTime: Date
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);