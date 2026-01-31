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


/**
 * Admin – Update coupon
 */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message
    });
  }
};


/**
 * Admin – Delete coupon
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message
    });
  }
};
