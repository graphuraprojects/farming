import "dotenv/config";   // ✅ this already loads env vars

import express from "express";
import "./configs/cloudinary.js";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import authRoutes from "./routes/authRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect DB
await connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true,
  }),
);

app.get("/", (req, res) => res.send("API is Working"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/earnings", earningRoutes);

// Admin Routes
//Admin Payment Routes
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/coupons", couponRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

//Profile update route 
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
