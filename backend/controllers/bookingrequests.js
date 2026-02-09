import Booking from "../models/Booking.model.js";

export const getPendingBookingRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner_id: req.user.userId,
      booking_status: "pending"
    })
      .populate("machine_id", "machine_name category images")
      .populate("farmer_id", "name address profile_pic");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Booking requests fetch failed" });
  }
};

export const acceptBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.booking_status = "accepted";
    await booking.save();

    res.json({ message: "Booking approved" });
  } catch (err) {
    res.status(500).json({ message: "Approve failed" });
  }
};

export const rejectBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.booking_status = "rejected";
    await booking.save();

    res.json({ message: "Booking rejected" });
  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
};