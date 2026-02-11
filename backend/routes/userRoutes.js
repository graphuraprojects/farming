import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { blockUser, createUser, deleteUser, getAllUsers, getMyProfile, getUserById, unblockUser, updateProfile } from "../controllers/userController.js";
import upload from "../configs/multer.js";

const router = express.Router();

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
  updateProfile
);

router.get("/:id", getUserById);

/* DELETE */
router.delete("/:id", protect, deleteUser);


router.patch("/:id/block", protect, blockUser);
router.patch("/:id/unblock", protect, unblockUser);

export default router;
