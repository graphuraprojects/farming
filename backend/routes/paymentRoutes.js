import express from "express";

import Booking from "../models/booking.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

// CREATE PAYMENT ORDER
router.post("/create-order", async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      message: "Payment gateway not configured (dev mode)",
    });
  }

  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const options = {
      amount: booking.total_amount * 100, // INR → paise
      currency: "INR",
      receipt: `booking_${booking._id}`,
    };

   const order = await razorpay.orders.create(options);


await Payment.create({
  booking_id: booking._id,
  razorpay_order_id: order.id,
  amount_paid: booking.total_amount,
  payment_status: "created",
});

res.status(200).json({
  order_id: order.id,
  amount: order.amount,
  currency: order.currency,
});
  } catch (error) {
    console.error("Razorpay error:", error);

res.status(500).json({
  message: "Payment order creation failed",
  error: error.message,
  stack: error.stack,
});
  }
});

// PAYMENT SUCCESS
router.post("/verify", async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      message: "Payment gateway not configured (dev mode)",
    });
  }

  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
    }

    await Booking.findByIdAndUpdate(booking_id, {
      booking_status: "confirmed",
      payment_status: "paid",
    });

    res.status(200).json({
      message: "Payment successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

export default router;