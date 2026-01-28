import Payment from "../models/Payment.model.js";
import Booking from "../models/Booking.model.js";

/**
 * Admin – Process payment & commission
 */
export const handlePaymentAndCommission = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.booking_status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Booking must be completed before payment"
      });
    }

    const total = booking.total_amount;
    const adminCommission = total * 0.05;
    const ownerAmount = total * 0.95;

    const payment = await Payment.create({
      booking_id: booking._id,
      farmer_id: booking.farmer_id,
      owner_id: booking.owner_id,
      total_amount: total,
      admin_commission: adminCommission,
      owner_amount: ownerAmount
    });

    res.status(201).json({
      success: true,
      message: "Payment & commission processed",
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message
    });
  }
};
