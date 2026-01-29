import Machine from "../models/Machine.model.js";

/**
 * ADD MACHINE (Owner/Admin)
 */
export const addMachine = async (req, res) => {
  try {
    // 1️⃣ Parse JSON data
    const data = JSON.parse(req.body.data);

    // 2️⃣ Get uploaded images
    const images = req.files?.map(file => file.path) || [];

    // 3️⃣ Create machine
    const machine = await Machine.create({
      owner_id: req.user.userId,
      machine_type: data.machine_type,
      price_per_hour: data.price_per_hour,
      base_location: data.base_location,
      availability_status: data.availability_status,
      images
    });

    return res.status(201).json({
      success: true,
      message: "Machine added successfully",
      data: machine
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
      error: error.message
    });
  }
};



/**
 * UPDATE MACHINE (Owner/Admin)
 */
export const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found"
      });
    }

    // Owner can edit only their machines
    if (
      req.user.role === "owner" &&
      machine.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can edit only your machines"
      });
    }

    const updatedMachine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Machine updated successfully",
      data: updatedMachine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update machine",
      error: error.message
    });
  }
};

/**
 * DELETE MACHINE (Owner/Admin)
 */
export const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found"
      });
    }

    if (
      req.user.role === "owner" &&
      machine.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your machines"
      });
    }

    await machine.deleteOne();

    res.status(200).json({
      success: true,
      message: "Machine deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete machine",
      error: error.message
    });
  }
};

/**
 * OWNER – TRACK EARNINGS (placeholder)
 */
export const trackEarnings = async (req, res) => {
  // Later connect with bookings & payments
  res.status(200).json({
    success: true,
    message: "Earnings fetched successfully",
    data: {
      totalEarnings: 0,
      commissionPaid: 0,
      netEarnings: 0
    }
  });
};


/* Set Price Per Hour (Owner/Admin) */

export const setPricePerHour = async (req, res) => {
  try {
    const { price_per_hour } = req.body;

    // Validation
    if (!price_per_hour || price_per_hour <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price per hour must be greater than 0"
      });
    }

    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found"
      });
    }

    // Owner can update only their machine
    if (
      req.user.role === "owner" &&
      machine.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can set price only for your own machine"
      });
    }

    machine.price_per_hour = price_per_hour;
    await machine.save();

    return res.status(200).json({
      success: true,
      message: "Price per hour updated successfully",
      data: {
        machineId: machine._id,
        price_per_hour: machine.price_per_hour
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update price",
      error: error.message
    });
  }
};


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
        availability_status: true
      };
    }

    // Optional query filters
    if (req.query.machine_type) {
      filter.machine_type = req.query.machine_type;
    }

    if (req.query.availability_status !== undefined) {
      filter.availability_status =
        req.query.availability_status === "true";
    }

    const machines = await Machine.find(filter)
      .populate("owner_id", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: machines.length,
      data: machines
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch machines",
      error: error.message
    });
  }
};
