import express from "express";
import {
  createInvoice,
  getInvoiceByBooking,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/create", createInvoice);
router.get("/booking/:bookingId", getInvoiceByBooking);

export default router;