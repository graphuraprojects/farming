import express from "express";
import {
  getFleetList,
  toggleMachineAvailability
} from "../controllers/fleet.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/list", protect, getFleetList);
router.patch("/:machineId/availability", protect, toggleMachineAvailability);

export default router;