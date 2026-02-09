import express from "express";
import { getTotalRevenue } from "../controllers/totalrevenue.js";
import { getEarningsTrend } from "../controllers/earningstrend.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/total-revenue", protect, getTotalRevenue);
router.get("/earnings-trend", protect, getEarningsTrend);

export default router;