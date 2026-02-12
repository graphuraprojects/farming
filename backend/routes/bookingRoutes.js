import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";
import { createBooking, decideBooking, getBookingById, getBookings } from "../controllers/bookingController.js";

const router = express.Router();

// Create booking (farmer)
router.post("/create", protect, createBooking);

// Accept / Reject booking
router.patch(
  "/:id/decision",
  protect,
  allowOwnerOrAdmin,
  decideBooking
);

router.get("/:id",protect, getBookingById);

// Get all bookings for logged-in user
router.get("/", protect, getBookings);

export default router;
