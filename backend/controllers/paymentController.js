import razorpay from "../configs/razorpay.js";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import crypto from "crypto";

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { booking_id, total_amount } = req.body;

    console.log("Received create-order request:", { booking_id, total_amount });

    if (!booking_id || !total_amount) {
      return res.status(400).json({ message: "Missing booking or amount" });
    }

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking belongs to the logged-in user (if using auth)
    if (req.user && booking.farmer_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const amountInPaise = Math.round(total_amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking_id}`,
    });

    console.log("Razorpay order created:", order);

    // Create payment record
    await Payment.create({
      booking_id: booking._id,
      farmer_id: booking.farmer_id,
      owner_id: booking.owner_id,
      total_amount,
      admin_commission: total_amount * 0.1,
      owner_amount: total_amount * 0.9,
      razorpay_order_id: order.id,
      payment_status: "pending",
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ 
      message: "Order creation failed",
      error: err.message 
    });
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

    console.log("Received verify request:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "paid",
      },
      { new: true }
    );

    console.log("Payment updated:", payment);

    // ✅ CRITICAL: Only update payment_status, NOT booking_status
    // Booking should remain "pending" until owner accepts
    const booking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        payment_status: "paid",
        // booking_status stays "pending" - owner must approve
      },
      { new: true }
    );

    console.log("Booking payment status updated:", booking);

    res.json({ 
      success: true,
      message: "Payment verified successfully",
      booking: {
        id: booking._id,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status
      }
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ 
      message: "Verification failed",
      error: err.message 
    });
  }
};