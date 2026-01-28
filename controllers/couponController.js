import Coupon from "../models/Coupon.model.js";

/**
 * Admin – Create coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message
    });
  }
};

/**
 * Admin – Get all coupons
 */
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json({ success: true, data: coupons });
};
