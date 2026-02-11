import Booking from "../models/Booking.model.js";

/**
 * TRACK EARNINGS (Owner/Admin)
 */
export const trackEarnings = async (req, res) => {
  try {
    let filter = {
      booking_status: { $in: ["accepted", "completed"] },
    };

    if (req.user.role === "owner") {
      filter.owner_id = req.user.userId;
    }

    const bookings = await Booking.find(filter);

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (booking.total_amount || 0),
      0,
    );

    const adminCommission = totalRevenue * 0.05;
    const ownerEarnings = totalRevenue * 0.95;

    res.status(200).json({
      success: true,
      data: {
        total_bookings: bookings.length,
        total_revenue: totalRevenue,
        admin_commission: adminCommission,
        owner_earnings: ownerEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
      error: error.message,
    });
  }
};
