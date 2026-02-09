import Booking from "../models/Booking.model.js";
import Machine from "../models/Machine.model.js";

/**
 * ACCEPT OR REJECT BOOKING (Owner/Admin)
 */
export const decideBooking = async (req, res) => {
  try {
    const { action, rejection_reason } = req.body;
    const bookingId = req.params.id;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be accept or reject"
      });
    }

    const booking = await Booking.findById(bookingId).populate("machine_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Only pending bookings
    if (booking.booking_status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed"
      });
    }

    // Owner check
    if (
      req.user.role === "owner" &&
      booking.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can decide only your machine bookings"
      });
    }

    if (action === "accept") {
      booking.booking_status = "accepted";
      booking.decision_at = new Date();
    }

    if (action === "reject") {
      if (!rejection_reason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required"
        });
      }

      booking.booking_status = "rejected";
      booking.rejection_reason = rejection_reason;
      booking.decision_at = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${action}ed successfully`,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process booking",
      error: error.message
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    let filter = {};

    // Farmer → only his bookings
    if (req.user.role === "farmer") {
      filter.farmer_id = req.user.userId;
    }

    // Owner → bookings of his machines
    else if (req.user.role === "owner") {
      filter.owner_id = req.user.userId;
    }

    // Admin → no filter (all)
    else if (req.user.role === "admin") {
      filter = {};
    }

    // Optional status filter (for history/current)
    if (req.query.status) {
      filter.booking_status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate("machine_id", "machine_name images price_per_hour")
      .populate("farmer_id", "name phone")
      .populate("owner_id", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message
    });
  }
};