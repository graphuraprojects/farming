import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";

/**
 * Admin – View analytics dashboard
 */
export const getAdminAnalytics = async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({ booking_status: "completed" });

  const payments = await Payment.find();
  const totalRevenue = payments.reduce((sum, p) => sum + p.total_amount, 0);
  const adminEarnings = payments.reduce((sum, p) => sum + p.admin_commission, 0);

  res.json({
    success: true,
    data: {
      totalBookings,
      completedBookings,
      totalRevenue,
      adminEarnings
    }
  });
};
