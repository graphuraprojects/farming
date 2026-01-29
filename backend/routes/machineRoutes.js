import express from "express";
import {
  addMachine,
  updateMachine,
  deleteMachine,
  setPricePerHour,
  getAllMachines
} from "../controllers/machineController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";

import {upload} from "../configs/multer.js";

const router = express.Router();

// Add a new machine (Owner/Admin only)
// Supports image upload and machine details
router.post(
  "/",
  protect,
  allowOwnerOrAdmin,
  upload.array("images", 5),
  addMachine
);

// Update machine details (Owner/Admin only)
// Owner can update only their own machines
router.put("/:id", protect, allowOwnerOrAdmin, updateMachine);

// Delete a machine (Owner/Admin only)
// Removes machine permanently from the system
router.delete("/:id", protect, allowOwnerOrAdmin, deleteMachine);

// Set or update machine price per hour (Owner/Admin only)
// Used to control hourly rental cost
router.patch(
  "/:id/price",
  protect,
  allowOwnerOrAdmin,
  setPricePerHour
);


// Get all machines
// Public (farmers) + Owner + Admin
router.get("/", protect, getAllMachines);

export default router;
