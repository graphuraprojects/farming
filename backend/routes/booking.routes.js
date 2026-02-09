import express from "express";
import {
  getPendingBookingRequests,
  acceptBookingRequest,
  rejectBookingRequest
} from "../controllers/bookingrequests.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/pending-requests", protect, getPendingBookingRequests);
router.patch("/:bookingId/approve", protect, acceptBookingRequest);
router.patch("/:bookingId/reject", protect, rejectBookingRequest);

export default router;