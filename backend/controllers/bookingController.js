import Booking from "../models/Booking.model.js";
import Machine from "../models/Machine.model.js";
import User from "../models/User.model.js";
/**
 * CREATE BOOKING (Farmer)
 */
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const createBooking = async (req, res) => {
  try {
    console.log("\n========== CREATE BOOKING START ==========");

    // 1️⃣ Log Request
    console.log("Full req.body:", req.body);
    console.log("Logged user:", req.user);

    if (!req.user || !req.user.userId) {
      console.log("❌ No authenticated user found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 2️⃣ Destructure Fields
    const { machine_id, start_date, start_time, end_time, total_hours } =
      req.body;

    console.log("Parsed fields:", {
      machine_id,
      start_date,
      start_time,
      end_time,
      total_hours,
    });

    // 3️⃣ Validate Required Fields
    if (
      !machine_id ||
      !start_date ||
      !start_time ||
      !end_time ||
      total_hours == null
    ) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 4️⃣ Fetch Machine
    const machine = await Machine.findById(machine_id);
    console.log("Machine found:", machine?._id);

    if (!machine) {
      console.log("❌ Machine not found");
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    // 5️⃣ Fetch Farmer
    const farmer = await User.findById(req.user.userId);
    console.log("Farmer found:", farmer?._id);
    console.log("Farmer location:", farmer?.location);

    if (!farmer) {
      console.log("❌ Farmer not found");
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // 6️⃣ Validate Locations
    // Get farmer default address
    const defaultAddress = farmer.addresses?.find((a) => a.isDefault);

    if (
      !defaultAddress ||
      defaultAddress.latitude == null ||
      defaultAddress.longitude == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please set your default address with location.",
      });
    }

    if (
      machine?.location?.latitude == null ||
      machine?.location?.longitude == null
    ) {
      console.log("❌ Machine location missing");
      return res.status(400).json({
        success: false,
        message: "Machine location not available.",
      });
    }

    // 7️⃣ Convert total_hours safely
    const hours = Number(total_hours);

    if (isNaN(hours) || hours <= 0) {
      console.log("❌ Invalid total hours:", total_hours);
      return res.status(400).json({
        success: false,
        message: "Invalid total hours",
      });
    }

    // 8️⃣ Calculate Rent
    const rentAmount = hours * machine.price_per_hour;
    console.log("Rent amount:", rentAmount);

    // 9️⃣ Calculate Distance
    const distanceKm = getDistanceInKm(
      machine.location.latitude,
      machine.location.longitude,
      defaultAddress.latitude,
      defaultAddress.longitude,
    );

    console.log("Distance KM:", distanceKm);

    // 🔟 Calculate Transport (rate per KM)
    const transportRate = machine.transport || 0;
    const transportFee = Math.round(distanceKm * transportRate);

    console.log("Transport rate:", transportRate);
    console.log("Transport fee:", transportFee);

    // 1️⃣1️⃣ Final Amount
    const finalAmount = rentAmount + transportFee;
    console.log("Final amount:", finalAmount);

    // 1️⃣2️⃣ Create Date Objects
    const startDateTime = new Date(`${start_date}T${start_time}:00`);
    const endDateTime = new Date(`${start_date}T${end_time}:00`);

    console.log("Start DateTime:", startDateTime);
    console.log("End DateTime:", endDateTime);

    // 1️⃣3️⃣ Create Booking
    const booking = await Booking.create({
      farmer_id: farmer._id,
      machine_id: machine._id,
      owner_id: machine.owner_id,
      start_time: startDateTime,
      end_time: endDateTime,
      total_hours: hours,
      rent_amount: rentAmount,
      transport_fee: transportFee,
      total_amount: finalAmount,
      booking_status: "pending",
      payment_status: "pending",
    });

    console.log("✅ Booking created:", booking._id);
    console.log("========== CREATE BOOKING END ==========\n");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
        breakdown: {
          rent: rentAmount,
          transport: transportFee,
          distance_km: distanceKm.toFixed(2),
          total: finalAmount,
        },
      },
    });
  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/**ACCEPT OR REJECT BOOKING (Owner/Admin)*/
export const decideBooking = async (req, res) => {
  try {
    const { action, rejection_reason } = req.body;
    const bookingId = req.params.id;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be accept or reject",
      });
    }

    const booking = await Booking.findById(bookingId).populate("machine_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only pending bookings
    if (booking.booking_status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed",
      });
    }

    // Owner check
    if (
      req.user.role === "owner" &&
      booking.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can decide only your machine bookings",
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
          message: "Rejection reason is required",
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
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process booking",
      error: error.message,
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
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

export const getPendingBookingRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner_id: req.user.userId,
      booking_status: "pending",
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
/**
 * GET SINGLE BOOKING BY ID
 */
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate("machine_id", "machine_name images category price_per_hour")
      .populate("farmer_id", "name email phone address profile_pic")
      .populate("owner_id", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Authorization check - only farmer, owner, or admin can view
    if (
      booking.farmer_id._id.toString() !== req.user.userId &&
      booking.owner_id._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};
