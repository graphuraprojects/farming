import express from "express";
import {
  addMachine,
  updateMachine,
  deleteMachine,
  setPricePerHour,
  getAllMachines,
  approveOrRejectMachine,
  getAdminMachines,
  getMachineByIdAdmin
} from "../controllers/machineController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowOwnerAdminFarmer, allowOwnerOrAdmin } from "../middleware/roleMiddleware.js";
import upload from "../configs/multer.js";
import { allowAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowOwnerAdminFarmer,
  upload.fields([
  { name: "images", maxCount: 5 },
  { name: "ownership_proof", maxCount: 1 }
]),
  addMachine
);

router.put("/:id", protect, allowOwnerOrAdmin, updateMachine);
router.delete("/:id", protect, allowOwnerOrAdmin, deleteMachine);
router.patch("/:id/price", protect, allowOwnerOrAdmin, setPricePerHour);

// Get all machines
// Public (farmers) + Owner + Admin
router.get("/", protect, getAllMachines);

/**
 * Admin approve / reject machine
 */
router.patch(
  "/:id/approval",
  protect,
  allowAdmin,
  approveOrRejectMachine
);
router.get("/admin/all", protect, allowAdmin, getAdminMachines);
router.get("/admin/:id", protect, allowAdmin, getMachineByIdAdmin);


export default router;
