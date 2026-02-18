import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  blockUser,
  createUser,
  deleteUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  unblockUser,
  updateProfile,
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";

const router = express.Router();

/* CREATE USER */
router.post("/", createUser);

/* MY PROFILE */
router.get("/my-profile", protect, getMyProfile);

router.patch(
  "/profile",
  protect,
  (req, res, next) => {
    req.uploadFolder = "users";
    next();
  },
  upload.single("profile_pic"),
  updateProfile,
);

/* USERS */
router.get("/", protect, getAllUsers); // optional: admin only
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, deleteUser);

/* BLOCK / UNBLOCK */
router.patch("/:id/block", protect, blockUser);
router.patch("/:id/unblock", protect, unblockUser);

/* ADDRESS ROUTES */
router.post("/addresses", protect, addAddress);
router.get("/addresses", protect, getAllAddresses);
router.patch("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.patch("/addresses/:addressId/default", protect, setDefaultAddress);
router.get("/addresses/default", protect, getDefaultAddress);

export default router;