import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";
import { decideBooking } from "../controllers/BookingController.js";
const router = express.Router();

// Accept or reject a booking request (Owner/Admin only)
// Updates booking status to accepted or rejected
router.patch(
  "/:id/decision",
  protect,
  allowOwnerOrAdmin,
  decideBooking
);

export default router;
