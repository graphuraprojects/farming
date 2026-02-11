import express from "express";
// import Payment from "../models/Payment.model.js";
// import Booking from "../models/Booking.model.js";
// import razorpay from "../configs/razorpay.js";
// import crypto from "crypto";
import {protect} from "../middleware/authMiddleware.js"
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// // ================= CREATE ORDER =================
// router.post("/create-order", async (req, res) => {
//   try {
//     if (!razorpay) {
//       return res.status(503).json({
//         message: "Payment gateway not configured",
//       });
//     }

//     const { booking_id, total_amount } = req.body;

//     if (!booking_id || !total_amount) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const booking = await Booking.findById(booking_id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Commission split
//     const adminCommission = total_amount * 0.1;
//     const ownerAmount = total_amount - adminCommission;

//     // Razorpay order
//     const order = await razorpay.orders.create({
//       amount: total_amount * 100,
//       currency: "INR",
//       receipt: `booking_${booking._id}`,
//     });

//     // Create payment record
//     await Payment.create({
//       booking_id: booking._id,
//       farmer_id: booking.farmer_id,
//       owner_id: booking.owner_id,
//       total_amount,
//       admin_commission: adminCommission,
//       owner_amount: ownerAmount,
//       razorpay_order_id: order.id,
//       payment_status: "pending",
//     });

//     res.json({
//       order_id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Order creation failed" });
//   }
// });

// // ================= VERIFY PAYMENT =================
// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       booking_id,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Update booking
//     await Booking.findByIdAndUpdate(booking_id, {
//       booking_status: "confirmed",
//       payment_status: "paid",
//     });

//     // Update payment record
//     await Payment.findOneAndUpdate(
//       { razorpay_order_id },
//       {
//         razorpay_payment_id,
//         razorpay_signature,
//         payment_status: "paid",
//       },
//     );

//     res.json({ message: "Payment verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Verification failed" });
//   }
// });
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
