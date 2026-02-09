import Booking from "../models/Booking.model.js";

const getDateRange = (range) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (range === "last") {
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setDate(1);
    end.setHours(0, 0, 0, 0);
    return { start, end };
  }

  if (range === "ytd") {
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { start, end: null };
  }

  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return { start, end: null };
};

export const getEarningsTrend = async (req, res) => {
  try {
    const range = req.query.range || "month";
    const { start, end } = getDateRange(range);
    const createdAtFilter = end ? { $gte: start, $lt: end } : { $gte: start };

    const data = await Booking.aggregate([
      {
        $match: {
          owner_id: req.user.userId,
          booking_status: "completed",
          createdAt: createdAtFilter
        }
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          revenue: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Earnings trend fetch failed" });
  }
};