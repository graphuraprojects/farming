import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import upload from "../configs/multer.js";

const router = express.Router();

router.patch(
  "/profile",
  protect,
  (req, res, next) => {
    req.uploadFolder = "users"; // 🔥 Cloudinary folder
    next();
  },
  upload.single("profile_pic"),
  updateProfile
);

export default router;
