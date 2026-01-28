import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowAdmin } from "../middleware/roleMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

// View analytics & reports
router.get("/", protect, allowAdmin, getAdminAnalytics);

export default router;
