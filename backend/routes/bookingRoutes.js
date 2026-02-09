import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";
import { decideBooking, getBookings } from "../controllers/bookingController.js";

const router = express.Router();

// Accept / Reject booking
router.patch(
  "/:id/decision",
  protect,
  allowOwnerOrAdmin,
  decideBooking
);

// Get all bookings for logged-in user
router.get("/", protect, getBookings);

export default router;
