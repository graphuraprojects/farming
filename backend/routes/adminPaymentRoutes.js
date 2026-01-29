import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowAdmin } from "../middleware/roleMiddleware.js";
import { handlePaymentAndCommission } from "../controllers/adminPaymentController.js";

const router = express.Router();

// Process payment & admin commission
router.post(
  "/process",
  protect,
  allowAdmin,
  handlePaymentAndCommission
);

export default router;
