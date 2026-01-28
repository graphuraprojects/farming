import express from "express";
import { trackEarnings } from "../controllers/earningController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Fetch total earnings for Owner or Admin
// Includes gross earnings, commission, and net amount
router.get(
  "/",
  protect,
  allowOwnerOrAdmin,
  trackEarnings
);

export default router;
