import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowAdmin } from "../middleware/roleMiddleware.js";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from "../controllers/couponController.js";

const router = express.Router();

// Create coupon (Admin only)
router.post("/", protect, allowAdmin, createCoupon);

// Get all coupons (Admin only)
router.get("/", protect, allowAdmin, getCoupons);

// Update coupon (Admin only)
router.put("/:id", protect, allowAdmin, updateCoupon);

// Delete coupon (Admin only)
router.delete("/:id", protect, allowAdmin, deleteCoupon);

export default router;
