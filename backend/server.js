import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import cors from "cors";

dotenv.config(); // Load .env file

const app = express();
const port = process.env.PORT || 5000;

//  Connect Database & Cloudinary
await connectDB();
await connectCloudinary();

//  Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true,
  }),
);

// Default Route
app.get("/", (req, res) => res.send("API is Working "));

//  API Routes

app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/earnings", earningRoutes);

//Admin Payment Routes
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/coupons", couponRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

// Start Server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
