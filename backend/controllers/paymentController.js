import razorpay from "../configs/razorpay.js";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import Machine from "../models/Machine.model.js";
import User from "../models/User.model.js";
import { sendEmail } from "../configs/sendEmail.js";
import crypto from "crypto";

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { booking_id, total_amount } = req.body;

    console.log("Received create-order request:", { booking_id, total_amount });

    if (!booking_id || !total_amount) {
      return res.status(400).json({ message: "Missing booking or amount" });
    }

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking belongs to the logged-in user (if using auth)
    if (req.user && booking.farmer_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const amountInPaise = Math.round(total_amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking_id}`,
    });

    console.log("Razorpay order created:", order);

    // Create payment record
    await Payment.create({
      booking_id: booking._id,
      farmer_id: booking.farmer_id,
      owner_id: booking.owner_id,
      total_amount,
      admin_commission: total_amount * 0.1,
      owner_amount: total_amount * 0.9,
      razorpay_order_id: order.id,
      payment_status: "pending",
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ 
      message: "Order creation failed",
      error: err.message 
    });
  }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = req.body;

    console.log("Received verify request:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "paid",
      },
      { new: true }
    );

    console.log("Payment updated:", payment);

    // ✅ CRITICAL: Only update payment_status, NOT booking_status
    // Booking should remain "pending" until owner accepts
    const booking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        payment_status: "paid",
        // booking_status stays "pending" - owner must approve
      },
      { new: true }
    )
      .populate("farmer_id", "name email phone")
      .populate("machine_id", "machine_name model category price_per_day images")
      .populate("owner_id", "name phone");

    console.log("Booking payment status updated:", booking);

    // Send payment confirmation email to farmer
    if (booking.farmer_id && booking.farmer_id.email) {
      const farmer = booking.farmer_id;
      const machine = booking.machine_id;
      const owner = booking.owner_id;

      const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

     const paymentSuccessEmailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header with green background -->
            <tr>
              <td style="background: linear-gradient(135deg, #03a74f 0%, #038a42 100%); padding: 40px 30px; text-align: center;">
                <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 48px;">✓</span>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                  Payment Successful!
                </h1>
                <p style="margin: 10px 0 0 0; color: #e6f7ed; font-size: 16px;">
                  Your payment has been processed
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                  Dear <strong>${farmer.name}</strong>,
                </p>
                
                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                  Great news! Your payment has been successfully processed. Your booking request is now awaiting approval from the machine owner.
                </p>

                <!-- Payment Summary Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">
                        💳 Payment Details
                      </h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666; font-size: 14px; width: 40%;">Payment ID:</td>
                          <td style="color: #333; font-size: 13px; font-family: monospace; font-weight: 600;">${razorpay_payment_id}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Transaction ID:</td>
                          <td style="color: #333; font-size: 13px; font-family: monospace; font-weight: 600;">${razorpay_order_id}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Amount Paid:</td>
                          <td style="color: #03a74f; font-size: 18px; font-weight: 700;">₹${booking.total_amount.toLocaleString("en-IN")}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Payment Status:</td>
                          <td style="color: #03a74f; font-size: 14px; font-weight: 700;">✓ PAID</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Booking Details Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8faf9; border-radius: 8px; margin: 30px 0; border: 1px solid #e6f7ed;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">
                        🚜 Booking Information
                      </h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666; font-size: 14px; width: 40%;">Booking ID:</td>
                          <td style="color: #333; font-size: 13px; font-family: monospace; font-weight: 600;">${booking._id}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Machine:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.machine_name}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Model:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.model} (${machine.category})</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Start Date:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${formatDate(booking.start_date)}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">End Date:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${formatDate(booking.end_date)}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Duration:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${booking.total_days} day${booking.total_days > 1 ? 's' : ''}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Daily Rate:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">₹${machine.price_per_day}/day</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Booking Status:</td>
                          <td style="color: #f59e0b; font-size: 14px; font-weight: 700;">⏳ PENDING APPROVAL</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Owner Details Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; margin: 30px 0; border: 1px solid #bfdbfe;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 15px 0; color: #2563eb; font-size: 18px;">
                        👤 Machine Owner
                      </h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666; font-size: 14px; width: 40%;">Name:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${owner.name}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px;">Contact:</td>
                          <td style="color: #333; font-size: 14px; font-weight: 600;">${owner.phone || "N/A"}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Status Info -->
                <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 0 0 10px 0; color: #856404; font-weight: 600; font-size: 14px;">
                    ⏳ What Happens Next?
                  </p>
                  <ol style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.8;">
                    <li>The machine owner has been notified of your booking request</li>
                    <li>They will review and either approve or reject your request</li>
                    <li><strong>If approved:</strong> Your booking will appear in "My Bookings" and you'll receive a confirmation email</li>
                    <li><strong>If rejected:</strong> You'll receive a rejection notification email and a full refund will be processed within 5-7 business days</li>
                  </ol>
                </div>

                <!-- Important Visibility Notice -->
                <div style="background-color: #e0f2fe; border: 1px solid #7dd3fc; padding: 20px; margin: 25px 0; border-radius: 8px;">
                  <h4 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px; font-weight: 700;">
                    📋 Booking Visibility Notice
                  </h4>
                  <p style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                    <strong>Please Note:</strong>
                  </p>
                  <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 13px; line-height: 1.8;">
                    <li><strong>Accepted bookings</strong> will be visible in your "My Bookings" section on the website</li>
                    <li><strong>Rejected bookings</strong> will NOT appear in your bookings list</li>
                    <li>You will receive email notifications for both acceptance and rejection</li>
                    <li>If rejected, the refund amount will be credited to your original payment method</li>
                  </ul>
                </div>

                <!-- Refund Policy -->
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                    <strong>💰 Refund Policy:</strong> In case of rejection by the owner, a full refund of ₹${booking.total_amount.toLocaleString("en-IN")} will be processed to your original payment method within 5-7 business days. You will receive a separate email confirmation once the refund is initiated.
                  </p>
                </div>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                  <tr>
                    <td align="center">
                      <a  
                         style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        Check Booking Status on Website
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                  We'll keep you updated via email about your booking status. Thank you for choosing AgriRent!
                </p>
                
                <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                  Best regards,<br>
                  <strong style="color: #03a74f;">The AgriRent Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f0fdf4; padding: 25px 30px; text-align: center; border-top: 1px solid #86efac;">
                <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                  Need help? <a href="mailto:support@agrirent.com" style="color: #03a74f; text-decoration: none;">support@agrirent.com</a>
                </p>
                <p style="margin: 0; color: #999999; font-size: 12px;">
                  © 2026 AgriRent. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

      const emailSent = await sendEmail({
        to: farmer.email,
        subject: "✓ Payment Successful - Booking Confirmed",
        html: paymentSuccessEmailHtml,
      });

      if (emailSent) {
        console.log("✅ Payment confirmation email sent to:", farmer.email);
      } else {
        console.log("⚠️ Failed to send payment confirmation email");
      }
    }

    res.json({ 
      success: true,
      message: "Payment verified successfully",
      booking: {
        id: booking._id,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status
      }
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ 
      message: "Verification failed",
      error: err.message 
    });
  }
};