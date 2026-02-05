import Machine from "../models/Machine.model.js";
import cloudinary from "../configs/cloudinary.js";

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

      price_per_hour: data.price_per_hour,

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

  const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({
    success: true,
    message: "Machine updated",
    data: updated,
  });
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
export const setPricePerHour = async (req, res) => {
  const { price_per_hour } = req.body;

  if (!price_per_hour || price_per_hour <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    return res
      .status(404)
      .json({ success: false, message: "Machine not found" });
  }

  machine.price_per_hour = price_per_hour;
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

    // Admin → no filter
    if (req.user?.role === "admin") {
      filter = {};
    }

    // Owner → only own machines
    else if (req.user?.role === "owner") {
      filter.owner_id = req.user.userId;
    }

    // Farmer / Public
    else {
      filter = {
        isApproved: true,
        availability_status: true,
      };
    }

    // Optional query filters
    if (req.query.machine_type) {
      filter.machine_type = req.query.machine_type;
    }

    if (req.query.availability_status !== undefined) {
      filter.availability_status = req.query.availability_status === "true";
    }

    const machines = await Machine.find(filter)
      .populate("owner_id", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: machines.length,
      data: machines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch machines",
      error: error.message,
    });
  }
}; /**
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

    const machine = await Machine.findById(id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    if (action === "approve") {
      machine.isApproved = true;
      machine.rejection_reason = "";
    }

    if (action === "reject") {
      if (!rejection_reason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      machine.isApproved = false;
      machine.rejection_reason = rejection_reason;
    }

    await machine.save();

    res.status(200).json({
      success: true,
      message: `Machine ${action}d successfully`,
      data: machine,
    });
  } catch (error) {
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
      data: machines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machines",
      error: error.message
    });
  }
};
export const getMachineByIdAdmin = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
      .populate("owner_id", "name email phone");

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found"
      });
    }

    res.json({
      success: true,
      data: machine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machine",
      error: error.message
    });
  }
};
