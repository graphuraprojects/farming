import Booking from "../models/Booking.model.js";

export const getPendingBookingRequests = async (req, res) => {
  try {
    console.log("👤 Fetching pending requests for owner:", req.user.userId);
    
    // ✅ Show ALL pending bookings (payment status doesn't matter yet)
    const bookings = await Booking.find({
      owner_id: req.user.userId,
      booking_status: "pending", // Only pending status
      // ❌ REMOVED: payment_status: "paid" - Owner should see requests BEFORE payment
    })
      .populate("machine_id", "machine_name category images price_per_hour")
      .populate("farmer_id", "name email phone address profile_pic")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${bookings.length} pending bookings for owner ${req.user.userId}`);
    console.log("📋 Bookings:", bookings.map(b => ({
      id: b._id,
      farmer: b.farmer_id?.name,
      machine: b.machine_id?.machine_name,
      status: b.booking_status,
      payment: b.payment_status
    })));

    res.json(bookings);
  } catch (err) {
    console.error("❌ Pending requests error:", err);
    res.status(500).json({ 
      success: false,
      message: "Booking requests fetch failed",
      error: err.message 
    });
  }
};

export const acceptBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    // Check ownership
    if (booking.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized - this is not your machine" 
      });
    }

    // ✅ Check if already processed
    if (booking.booking_status !== "pending") {
      return res.status(400).json({ 
        success: false,
        message: `Booking already ${booking.booking_status}` 
      });
    }

    // ✅ Accept the booking (payment can happen after acceptance)
    booking.booking_status = "accepted";
    booking.decision_at = new Date();
    await booking.save();

    console.log("✅ Booking accepted:", booking._id);

    res.json({ 
      success: true,
      message: "Booking approved successfully. Farmer can now proceed with payment.",
      data: booking 
    });
  } catch (err) {
    console.error("❌ Approve error:", err);
    res.status(500).json({ 
      success: false,
      message: "Approve failed",
      error: err.message 
    });
  }
};

export const rejectBookingRequest = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    // Check ownership
    if (booking.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized - this is not your machine" 
      });
    }

    // ✅ Check if already processed
    if (booking.booking_status !== "pending") {
      return res.status(400).json({ 
        success: false,
        message: `Booking already ${booking.booking_status}` 
      });
    }

    // ✅ Reject the booking
    booking.booking_status = "rejected";
    booking.rejection_reason = rejection_reason || "No reason provided";
    booking.decision_at = new Date();
    await booking.save();

    console.log("✅ Booking rejected:", booking._id);

    // ✅ If payment was already made, initiate refund
    if (booking.payment_status === "paid") {
      console.log("⚠️ TODO: Initiate Razorpay refund for booking:", booking._id);
      // TODO: Add Razorpay refund logic here
    }

    res.json({ 
      success: true,
      message: "Booking rejected successfully",
      data: booking 
    });
  } catch (err) {
    console.error("❌ Reject error:", err);
    res.status(500).json({ 
      success: false,
      message: "Reject failed",
      error: err.message 
    });
  }
};