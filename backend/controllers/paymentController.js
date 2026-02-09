// controllers/bookingController.js
import Booking from "../models/booking.js";
import Machine from "../models/Machine.js";
import { calculateTotalHours, calculatePricing } from "../utils/pricingCalc.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { farmer_id, machine_id, start_time, end_time } = req.body;

    const machine = await Machine.findById(machine_id);
    if (!machine || !machine.availability_status)
      return res.status(400).json({ message: "Machine unavailable" });

    const conflict = await Booking.findOne({
      machine_id,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });
    if (conflict)
      return res.status(409).json({ message: "Already booked" });

    const totalHours = calculateTotalHours(start_time, end_time);
    const transportCost = 200;

    const pricing = calculatePricing({
      totalHours,
      pricePerHour: machine.price_per_hour,
      transportCost,
    });

    const booking = await Booking.create({
      farmer_id,
      machine_id,
      start_time,
      end_time,
      total_hours: totalHours,
      ...pricing,
      booking_status: "pending",
    });

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findByIdAndDelete(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}