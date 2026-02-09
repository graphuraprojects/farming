import Booking from "../models/Booking.model.js";
import Invoice from "../models/invoice.model.js";

export const createInvoice = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("farmer_id", "name phone")
      .populate("owner_id", "name email")
      .populate({
        path: "machine_id",
        model: "Machine"
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.machine_id) {
      return res.status(400).json({
        message: "Machine deleted or invalid booking data"
      });
    }

    if (booking.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment not completed"
      });
    }

    const machine = booking.machine_id;

    const machineCost = machine.price_per_hour * booking.total_hours;
    const transportCost = booking.transport_cost || 0;
    const subtotal = machineCost + transportCost;

    const platformFee = +(subtotal * 0.01).toFixed(2);
    const tax = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + platformFee + tax).toFixed(2);

    const invoice = await Invoice.create({
      invoiceId: `INV-${Date.now()}`,
      bookingId: booking._id,

      farmerId: booking.farmer_id._id,
      ownerId: booking.owner_id,

      items: [
        {
          machineName: machine.machine_name,
          model: machine.model,
          ratePerHour: machine.price_per_hour,
          hours: booking.total_hours,
          transportCharge: transportCost,
          subtotal
        }
      ],

      subtotal,
      platformFee,
      tax,
      totalAmount,

      paymentStatus: "PAID",
      paymentTime: new Date()
    });

    res.status(201).json({
      success: true,
      invoice
    });

  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({ message: "Invoice creation failed" });
  }
};

export const getInvoiceByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const invoice = await Invoice.findOne({ bookingId })
      .populate("farmerId", "name email")
      .populate("ownerId", "name email");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Get Invoice Error:", error);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};