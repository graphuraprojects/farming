import Booking from "../models/Booking.model.js";
import Invoice from "../models/invoice.model.js";
import mongoose from "mongoose";

export const createInvoice = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("farmer_id", "name email")
      .populate("owner_id", "name email")
      .populate("machine_id");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const machine = booking.machine_id;

    const machineCost = machine.price_per_day * booking.total_days;
    const transportCost = booking.transport_cost || 0;
    const subtotal = machineCost + transportCost;

    const platformFee = +(subtotal * 0.01).toFixed(2);
    const taxPercent = 5;
    const taxAmount = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + platformFee + taxAmount).toFixed(2);

    const invoice = await Invoice.create({
      invoiceId: `INV-${Date.now()}`,
      bookingId: booking._id,

      farmerId: booking.farmer_id._id,
      ownerId: booking.owner_id._id,

      items: [
        {
          machineName: machine.machine_name,
          model: machine.model,
          ratePerDay: machine.price_per_day,
          days: booking.total_days,
          transportCharge: transportCost,
          subtotal,
        },
      ],

      subtotal,
      platformFee,
      tax: taxAmount,
      totalAmount,

      paymentStatus: "PAID",
      paymentTime: new Date(),
    });

    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ message: "Invoice creation failed" });
  }
};

export const getInvoiceByBooking = async (req, res) => {
  try {
    console.log("\n========== GET INVOICE START ==========");
    console.log("📌 bookingId param:", req.params.bookingId);

    const bookingId = req.params.bookingId;

    if (!bookingId) {
      console.log("❌ bookingId missing");
      return res.status(400).json({ message: "bookingId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.log("❌ bookingId invalid format");
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    const invoice = await Invoice.findOne({ bookingId })
      .populate("farmerId", "name email")
      .populate("ownerId", "name email");

    if (!invoice) {
      console.log("❌ Invoice not found");
      return res.status(404).json({ message: "Invoice not found" });
    }

    console.log("✅ Invoice Found:", invoice._id);
    console.log("========== GET INVOICE END ==========\n");

    res.json({ success: true, invoice });
  } catch (error) {
    console.error("🚨 Get Invoice Error:", error);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};
