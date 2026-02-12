import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";

export const getAdminAnalytics = async (req, res) => {
  const totalBookings = await Booking.countDocuments();

  const completedBookings = await Booking.countDocuments({
    booking_status: "completed",
  });

  const payments = await Payment.find({ payment_status: "paid" });

  const totalRevenue = payments.reduce((sum, p) => sum + p.total_amount, 0);

  const adminEarnings = payments.reduce(
    (sum, p) => sum + p.admin_commission,
    0,
  );

  /* ==========================
     Monthly Revenue Aggregation
  ========================== */

  const monthlyRevenueAgg = await Payment.aggregate([
    { $match: { payment_status: "paid" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$total_amount" },
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyRevenue = months.map((month, index) => {
    const found = monthlyRevenueAgg.find((m) => m._id === index + 1);

    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  res.json({
    success: true,
    data: {
      totalBookings,
      completedBookings,
      totalRevenue,
      adminEarnings,
      monthlyRevenue,
    },
  });
};
