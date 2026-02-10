import "dotenv/config"; // ✅ this already loads env vars

import express from "express";
import "./configs/cloudinary.js";
// import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import authRoutes from "./routes/authRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import fleetRoutes from "./routes/fleet.routes.js";
import bookingOwnerRoutes from "./routes/booking.routes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// dotenv.config();

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
app.use("/api/owner/dashboard", dashboardRoutes);
app.use("/api/owner/fleet", fleetRoutes);
app.use("/api/owner/bookings", bookingOwnerRoutes);
// app.use("/api/payments", paymentRoutes);

// Admin Routes
//Admin Payment Routes
app.use("/api/admin/payments", paymentRoutes);
app.use("/api/admin/coupons", couponRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/adminAuth", adminAuthRoutes);
app.use("/api/contact", contactRoutes);

//Profile update route
app.use("/api/users", userRoutes);

// invoice
app.use("/api/invoice", invoiceRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
