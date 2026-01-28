import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowAdmin } from "../middleware/roleMiddleware.js";
import { createCoupon, getCoupons } from "../controllers/couponController.js";

const router = express.Router();

// Create coupon
router.post("/", protect, allowAdmin, createCoupon);

// Get all coupons
router.get("/", protect, allowAdmin, getCoupons);

export default router;
