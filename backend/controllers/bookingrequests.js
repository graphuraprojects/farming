import Booking from "../models/Booking.model.js";
import { sendEmail } from "../configs/sendEmail.js";

export const getPendingBookingRequests = async (req, res) => {
  try {
    console.log("👤 Fetching pending requests for owner:", req.user.userId);
    
    // ✅ Show ALL pending bookings (payment status doesn't matter yet)
    const bookings = await Booking.find({
      owner_id: req.user.userId,
      booking_status: "pending", // Only pending status
      // ❌ REMOVED: payment_status: "paid" - Owner should see requests BEFORE payment
    })
      .populate("machine_id", "machine_name category images price_per_hour")
      .populate("farmer_id", "name email phone address profile_pic")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${bookings.length} pending bookings for owner ${req.user.userId}`);
    console.log("📋 Bookings:", bookings.map(b => ({
      id: b._id,
      farmer: b.farmer_id?.name,
      machine: b.machine_id?.machine_name,
      status: b.booking_status,
      payment: b.payment_status
    })));

    res.json(bookings);
  } catch (err) {
    console.error("❌ Pending requests error:", err);
    res.status(500).json({ 
      success: false,
      message: "Booking requests fetch failed",
      error: err.message 
    });
  }
};

export const acceptBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("farmer_id", "name email phone")
      .populate("machine_id", "machine_name model category price_per_hour images")
      .populate("owner_id", "name phone");
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    // Check ownership
    if (booking.owner_id._id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized - this is not your machine" 
      });
    }

    // ✅ Check if already processed
    if (booking.booking_status !== "pending") {
      return res.status(400).json({ 
        success: false,
        message: `Booking already ${booking.booking_status}` 
      });
    }

    // ✅ Accept the booking
    booking.booking_status = "accepted";
    booking.decision_at = new Date();
    await booking.save();

    console.log("✅ Booking accepted:", booking._id);

    // Send acceptance email to farmer
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

      const acceptanceEmailHtml = `
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
                        <span style="font-size: 48px;">🎉</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        Booking Accepted!
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #e6f7ed; font-size: 16px;">
                        Your booking has been confirmed
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
                        Excellent news! The machine owner has <strong style="color: #03a74f;">accepted</strong> your booking request. Your rental is now confirmed and you can view it in your bookings dashboard.
                      </p>

                      <!-- Success Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <div style="width: 60px; height: 60px; background-color: #03a74f; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                              <span style="font-size: 32px; color: white;">✓</span>
                            </div>
                            <h3 style="margin: 0 0 10px 0; color: #03a74f; font-size: 20px; font-weight: 700;">
                              Booking Confirmed
                            </h3>
                            <p style="margin: 0; color: #15803d; font-size: 14px;">
                              You can now view this booking in "My Bookings"
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Booking Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8faf9; border-radius: 8px; margin: 30px 0; border: 1px solid #e6f7ed;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">
                              🚜 Booking Details
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
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${formatDate(booking.start_time)} at ${formatTime(booking.start_time)}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">End Date:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${formatDate(booking.end_time)} at ${formatTime(booking.end_time)}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Duration:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${booking.total_hours} hours</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Total Amount:</td>
                                <td style="color: #03a74f; font-size: 16px; font-weight: 700;">₹${booking.total_amount.toLocaleString("en-IN")}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Status:</td>
                                <td style="color: #03a74f; font-size: 14px; font-weight: 700;">✓ ACCEPTED</td>
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
                              👤 Machine Owner Contact
                            </h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 14px; width: 40%;">Name:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${owner.name}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Phone:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${owner.phone || "N/A"}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Next Steps -->
                      <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #856404; font-weight: 600; font-size: 14px;">
                          📌 Next Steps:
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px; line-height: 1.6;">
                          <li>Contact the owner to coordinate delivery/pickup details</li>
                          <li>Ensure you're available at the agreed start time</li>
                          <li>Inspect the machine before use</li>
                          <li>Report any issues immediately through the platform</li>
                        </ul>
                      </div>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                              View My Bookings
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        Thank you for choosing AgriRent!
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
        subject: "🎉 Booking Accepted - Rental Confirmed!",
        html: acceptanceEmailHtml,
      });

      if (emailSent) {
        console.log("✅ Acceptance email sent to:", farmer.email);
      } else {
        console.log("⚠️ Failed to send acceptance email");
      }
    }

    res.json({ 
      success: true,
      message: "Booking approved successfully. Farmer has been notified.",
      data: booking 
    });
  } catch (err) {
    console.error("❌ Approve error:", err);
    res.status(500).json({ 
      success: false,
      message: "Approve failed",
      error: err.message 
    });
  }
};

export const rejectBookingRequest = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const booking = await Booking.findById(req.params.bookingId)
      .populate("farmer_id", "name email phone")
      .populate("machine_id", "machine_name model category price_per_hour")
      .populate("owner_id", "name phone");
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    // Check ownership
    if (booking.owner_id._id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized - this is not your machine" 
      });
    }

    // ✅ Check if already processed
    if (booking.booking_status !== "pending") {
      return res.status(400).json({ 
        success: false,
        message: `Booking already ${booking.booking_status}` 
      });
    }

    // ✅ Reject the booking
    booking.booking_status = "rejected";
    booking.rejection_reason = rejection_reason || "No reason provided";
    booking.decision_at = new Date();
    await booking.save();

    console.log("✅ Booking rejected:", booking._id);

    // ✅ If payment was already made, initiate refund
    if (booking.payment_status === "paid") {
      console.log("⚠️ TODO: Initiate Razorpay refund for booking:", booking._id);
      // TODO: Add Razorpay refund logic here
    }

    // Send rejection email to farmer
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

      const rejectionEmailHtml = `
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
                  
                  <!-- Header with orange/red background -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 48px;">😔</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        Booking Not Approved
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 16px;">
                        The owner was unable to accept your request
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
                        Unfortunately, the machine owner has <strong>declined</strong> your booking request for the following machine.
                      </p>

                      <!-- Booking Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; margin: 30px 0; border: 1px solid #fecaca;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 18px;">
                              🚜 Booking Details
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
                                <td style="color: #666; font-size: 14px;">Requested Period:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">${formatDate(booking.start_time)} - ${formatDate(booking.end_time)}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Status:</td>
                                <td style="color: #dc2626; font-size: 14px; font-weight: 700;">✗ REJECTED</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Rejection Reason -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 700; font-size: 16px;">
                          📋 Reason for Rejection:
                        </p>
                        <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                          ${booking.rejection_reason}
                        </p>
                      </div>

                      ${booking.payment_status === "paid" ? `
                      <!-- Refund Information -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">
                              💰 Refund Information
                            </h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 14px; width: 40%;">Refund Amount:</td>
                                <td style="color: #03a74f; font-size: 18px; font-weight: 700;">₹${booking.total_amount.toLocaleString("en-IN")}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Refund Status:</td>
                                <td style="color: #f59e0b; font-size: 14px; font-weight: 700;">Processing</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Expected Timeline:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">5-7 Business Days</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px;">Refund Method:</td>
                                <td style="color: #333; font-size: 14px; font-weight: 600;">Original Payment Method</td>
                              </tr>
                            </table>
                            <p style="margin: 15px 0 0 0; color: #15803d; font-size: 13px; line-height: 1.6;">
                              ✓ Your full payment will be refunded to your original payment method within 5-7 business days.
                            </p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <!-- Alternative Options -->
                      <div style="background-color: #e0f2fe; border: 1px solid #7dd3fc; padding: 20px; margin: 25px 0; border-radius: 8px;">
                        <h4 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px; font-weight: 700;">
                          🔍 What You Can Do Next:
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 13px; line-height: 1.8;">
                          <li>Browse other available machines in the same category</li>
                          <li>Try booking for different dates when the machine might be available</li>
                          <li>Contact our support team if you need assistance finding alternatives</li>
                          <li>Check out similar machines from other owners</li>
                        </ul>
                      </div>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                              Browse Other Machines
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        We apologize for the inconvenience and hope you find the perfect machine for your needs.
                      </p>
                      
                      <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #03a74f;">The AgriRent Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #fef2f2; padding: 25px 30px; text-align: center; border-top: 1px solid #fecaca;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                        Need help? <a href="mailto:support@agrirent.com" style="color: #dc2626; text-decoration: none;">support@agrirent.com</a>
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
        subject: "Booking Request Declined - Refund Processing",
        html: rejectionEmailHtml,
      });

      if (emailSent) {
        console.log("✅ Rejection email sent to:", farmer.email);
      } else {
        console.log("⚠️ Failed to send rejection email");
      }
    }

    res.json({ 
      success: true,
      message: "Booking rejected successfully. Farmer has been notified.",
      data: booking 
    });
  } catch (err) {
    console.error("❌ Reject error:", err);
    res.status(500).json({ 
      success: false,
      message: "Reject failed",
      error: err.message 
    });
  }
};