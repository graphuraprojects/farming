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
import upload from "../configs/multer.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowOwnerOrAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "document", maxCount: 1 }
  ]),
  addMachine
);

router.put("/:id", protect, allowOwnerOrAdmin, updateMachine);
router.delete("/:id", protect, allowOwnerOrAdmin, deleteMachine);
router.patch("/:id/price", protect, allowOwnerOrAdmin, setPricePerHour);

// Public + Owner + Admin
router.get("/", protect, getAllMachines);

export default router;
