import express from "express";
import { setAvailability, getAvailability } from "../controllers/availabilityController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";


const router = express.Router();

// Update machine availability (only Owner or Admin)
// Used to mark machine as available or unavailable
router.put(
  "/:machineId",
  protect,
  allowOwnerOrAdmin,
  setAvailability
);

// Get machine availability details (Public / Farmer)
// Used before booking to check if machine is available
router.get("/:machineId", getAvailability);


export default router;
