// controllers/bookingController.js
// import Booking from "../models/booking.js";
import Machine from "../models/Machine.model.js";
// import { calculateTotalHours, calculatePricing } from "../utils/pricingCalc.js";
import razorpay from "../configs/razorpay.js";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import crypto from "crypto";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { farmer_id, machine_id, start_time, end_time } = req.body;

    const machine = await Machine.findById(machine_id);
    if (!machine || !machine.availability_status)
      return res.status(400).json({ message: "Machine unavailable" });

    const conflict = await Booking.findOne({
      machine_id,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });
    if (conflict) return res.status(409).json({ message: "Already booked" });

    const totalHours = calculateTotalHours(start_time, end_time);
    const transportCost = 200;

    const pricing = calculatePricing({
      totalHours,
      pricePerHour: machine.price_per_hour,
      transportCost,
    });

    const booking = await Booking.create({
      farmer_id,
      machine_id,
      start_time,
      end_time,
      total_hours: totalHours,
      ...pricing,
      booking_status: "pending",
    });

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findByIdAndDelete(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { booking_id, total_amount } = req.body;

    if (!booking_id || !total_amount) {
      return res.status(400).json({ message: "Missing booking or amount" });
    }

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const amountInPaise = Math.round(total_amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking_id}`,
    });

    await Payment.create({
      booking_id: booking._id,
      farmer_id: booking.farmer_id,
      owner_id: booking.owner_id,
      total_amount,
      admin_commission: total_amount * 0.1,
      owner_amount: total_amount * 0.9,
      razorpay_order_id: order.id,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "paid",
      },
    );

    await Booking.findByIdAndUpdate(booking_id, {
      payment_status: "paid",
      booking_status: "confirmed",
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};
