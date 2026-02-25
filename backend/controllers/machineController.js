import Machine from "../models/Machine.model.js";
import cloudinary from "../configs/cloudinary.js";
import { sendEmail } from "../configs/sendEmail.js";
/**
 * ADD MACHINE
 */
export const addMachine = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);

    // Multiple machine images
    const images =
      req.files?.images?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    // Ownership proof (single image)
    const ownershipProof = req.files?.ownership_proof?.[0]
      ? {
          url: req.files.ownership_proof[0].path,
          public_id: req.files.ownership_proof[0].filename,
        }
      : null;

    if (!ownershipProof) {
      return res.status(400).json({
        success: false,
        message: "Ownership proof image is required",
      });
    }

    const machine = await Machine.create({
      owner_id: req.user.userId,

      machine_name: data.machine_name,
      model: data.model,
      model_year: data.model_year,
      registration_no: data.registration_no,

      fuel_type: data.fuel_type,
      category: data.category,

      price_per_day: data.price_per_day,
      transport: data.transport,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
      },

      address: data.address,

      images,
      ownership_proof: ownershipProof,
    });

    res.status(201).json({
      success: true,
      message: "Machine added successfully",
      data: machine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add machine",
      error: error.message,
    });
  }
};

/**
 * UPDATE MACHINE
 */
export const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    if (
      req.user.role === "owner" &&
      machine.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await Machine.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        transport: req.body.transport ?? machine.transport,
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "Machine updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

/**
 * DELETE MACHINE
 */
export const deleteMachine = async (req, res) => {
  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    return res
      .status(404)
      .json({ success: false, message: "Machine not found" });
  }

  if (
    req.user.role === "owner" &&
    machine.owner_id.toString() !== req.user.userId
  ) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  // 🔥 Delete machine images
  for (const img of machine.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  // 🔥 Delete ownership proof image
  if (machine.ownership_proof?.public_id) {
    await cloudinary.uploader.destroy(machine.ownership_proof.public_id);
  }

  await machine.deleteOne();

  res.json({
    success: true,
    message: "Machine deleted successfully",
  });
};
/**
 * SET PRICE
 */
export const setPricePerDay = async (req, res) => {
  const { price_per_day } = req.body;

  if (!price_per_day || price_per_day <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    return res
      .status(404)
      .json({ success: false, message: "Machine not found" });
  }

  machine.price_per_day = price_per_day;
  await machine.save();

  res.json({
    success: true,
    message: "Price updated",
    data: machine,
  });
};

/**
 * GET MACHINES
 */
// export const getAllMachines = async (req, res) => {
//   let filter = {};

//   if (req.user?.role === "owner") {
//     filter.owner_id = req.user.userId;
//   } else if (!req.user || req.user.role === "farmer") {
//     filter = { isApproved: true, availability_status: true };
//   }

//   const machines = await Machine.find(filter)
//     .populate("owner_id", "name phone")
//     .sort({ createdAt: -1 });

//   res.json({
//     success: true,
//     count: machines.length,
//     data: machines
//   });
// };

/**
 * GET ALL MACHINES
 * - Admin: all machines
 * - Owner: only their machines
 * - Public/Farmer: approved + available machines only
 */
export const getAllMachines = async (req, res) => {
  try {
    let filter = {};

    if (req.user?.role === "admin") {
      filter = {};
    } else if (req.user?.role === "owner") {
      filter.owner_id = req.user.userId;
    } else {
      filter = {
        isApproved: true,
        availability_status: true,
      };
    }

    console.log("📋 getAllMachines - User role:", req.user?.role || "public", "| Filter:", JSON.stringify(filter));

    const machines = await Machine.find(filter)
      .populate("owner_id", "name phone")
      .sort({ createdAt: -1 });

    console.log("📋 getAllMachines - Found:", machines.length, "machines");

    // ⭐ AUTO CREATE SPECS
    const formattedMachines = machines.map((machine) => {
      const obj = machine.toObject();

      obj.specs = {
        model: obj.model,
        model_year: obj.model_year,
        fuel_type: obj.fuel_type,
        category: obj.category,
      };

      return obj;
    });

    return res.status(200).json({
      success: true,
      count: formattedMachines.length,
      data: formattedMachines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch machines",
      error: error.message,
    });
  }
};

/**
 * ADMIN – Approve or Reject Machine
 */
export const approveOrRejectMachine = async (req, res) => {
  try {
    const { action, rejection_reason } = req.body;
    const { id } = req.params;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be approve or reject",
      });
    }

    const machine = await Machine.findById(id).populate("owner_id", "name email");

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    // Get owner details for email
    const owner = machine.owner_id;

    if (!owner || !owner.email) {
      console.log("⚠️ Owner email not found");
    }

    // ✅ APPROVE
    if (action === "approve") {
      console.log("👉 Approval flow triggered");

      if (!machine.ownership_proof?.url) {
        console.log("❌ Ownership proof missing. Approval blocked.");
        return res.status(400).json({
          success: false,
          message: "Ownership document required to approve machine",
        });
      }

      machine.isApproved = true;
      machine.rejection_reason = "";

      console.log("✅ Machine marked APPROVED");

      // Send approval email
      if (owner && owner.email) {
        const approvalEmailHtml = `
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
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          🎉 Machine Approved!
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #e6f7ed; font-size: 16px;">
                          Your machine is now live on AgriRent
                        </p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Dear <strong>${owner.name}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Great news! Your machine <strong>"${machine.machine_name}"</strong> has been approved by our admin team and is now visible to farmers on the platform.
                        </p>

                        <!-- Machine Details Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8faf9; border-radius: 8px; margin: 30px 0; border: 1px solid #e6f7ed;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="margin: 0 0 15px 0; color: #03a74f; font-size: 18px;">
                                Machine Details
                              </h3>
                              <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                  <td style="color: #666; font-size: 14px; width: 40%;">Machine Name:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.machine_name}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px;">Model:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.model} (${machine.model_year})</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px;">Category:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.category}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px;">Price:</td>
                                  <td style="color: #03a74f; font-size: 16px; font-weight: 700;">₹${machine.price_per_day}/day</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Farmers can now discover and book your machine. Make sure to keep your availability updated to maximize your earnings!
                        </p>

                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/owner-dashboard" 
                                 style="display: inline-block; padding: 14px 32px; background-color: #03a74f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                View Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Tips Section -->
                        <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                          <p style="margin: 0 0 10px 0; color: #856404; font-weight: 600; font-size: 14px;">
                            💡 Tips to Get More Bookings:
                          </p>
                          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                            <li>Keep your machine availability status updated</li>
                            <li>Respond quickly to booking requests</li>
                            <li>Maintain your machine in good condition</li>
                            <li>Upload clear, high-quality images</li>
                          </ul>
                        </div>

                        <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Thank you for being part of AgriRent!
                        </p>
                        
                        <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Best regards,<br>
                          <strong style="color: #03a74f;">The AgriRent Team</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8faf9; padding: 25px 30px; text-align: center; border-top: 1px solid #e6f7ed;">
                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                          Need help? <a href="mailto:support@agrirent.com" style="color: #03a74f; text-decoration: none;">Contact Support</a>
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
          to: owner.email,
          subject: "🎉 Machine Approved - Ready to Rent!",
          html: approvalEmailHtml,
        });

        if (emailSent) {
          console.log("✅ Approval email sent to:", owner.email);
        } else {
          console.log("⚠️ Failed to send approval email");
        }
      }
    }

    // ✅ REJECT
    if (action === "reject") {
      console.log("👉 Rejection flow triggered");

      const trimmedReason = (rejection_reason || "").trim();

      console.log("Rejection reason received:", rejection_reason);
      console.log("Trimmed rejection reason:", trimmedReason);

      if (!trimmedReason) {
        console.log("❌ Rejection reason missing");
        return res.status(400).json({
          success: false,
          message: "Rejection reason required",
        });
      }

      machine.isApproved = false;
      machine.rejection_reason = trimmedReason;

      console.log("✅ Machine marked REJECTED");

      // Send rejection email
      if (owner && owner.email) {
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
                    
                    <!-- Header with red background -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          ⚠️ Machine Listing Rejected
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px;">
                          Action Required to List Your Machine
                        </p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Dear <strong>${owner.name}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Unfortunately, your machine <strong>"${machine.machine_name}"</strong> could not be approved at this time.
                        </p>

                        <!-- Machine Details Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; margin: 30px 0; border: 1px solid #fecaca;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 18px;">
                                Machine Details
                              </h3>
                              <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                  <td style="color: #666; font-size: 14px; width: 40%;">Machine Name:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.machine_name}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px;">Model:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.model} (${machine.model_year})</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px;">Registration:</td>
                                  <td style="color: #333; font-size: 14px; font-weight: 600;">${machine.registration_no}</td>
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
                            ${trimmedReason}
                          </p>
                        </div>

                        <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          Please review the rejection reason above and make the necessary corrections. You can edit your machine listing and resubmit for approval.
                        </p>

                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/my-machines" 
                                 style="display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                Edit Machine Details
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Important Notice -->
                        <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 15px; margin: 25px 0; border-radius: 4px;">
                          <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: 600; font-size: 14px;">
                            ⚠️ Important Notice:
                          </p>
                          <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                            Multiple rejections due to invalid information, fake documents, or spam submissions may result in temporary or permanent account suspension as per our Terms of Service.
                          </p>
                        </div>

                        <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          If you have any questions or need assistance, please don't hesitate to contact our support team.
                        </p>
                        
                        <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Best regards,<br>
                          <strong style="color: #dc2626;">The AgriRent Team</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #fef2f2; padding: 25px 30px; text-align: center; border-top: 1px solid #fecaca;">
                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                          Need help? <a href="mailto:support@agrirent.com" style="color: #dc2626; text-decoration: none;">Contact Support</a>
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
          to: owner.email,
          subject: "⚠️ Machine Listing Rejected - Action Required",
          html: rejectionEmailHtml,
        });

        if (emailSent) {
          console.log("✅ Rejection email sent to:", owner.email);
        } else {
          console.log("⚠️ Failed to send rejection email");
        }
      }
    }

    await machine.save();

    res.status(200).json({
      success: true,
      message: `Machine ${action}ed successfully. Email notification sent to owner.`,
      data: machine,
    });
  } catch (error) {
    console.error("❌ Approve/Reject error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update machine status",
      error: error.message,
    });
  }
};


export const getAdminMachines = async (req, res) => {
  try {
    const machines = await Machine.find()
      .populate("owner_id", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: machines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machines",
      error: error.message,
    });
  }
};
export const getMachineByIdAdmin = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate(
      "owner_id",
      "name email phone",
    );

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    res.json({
      success: true,
      data: machine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machine",
      error: error.message,
    });
  }
};
