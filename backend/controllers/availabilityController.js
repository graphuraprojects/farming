import Availability from "../models/Availability.model.js";
import Machine from "../models/Machine.model.js";

/**
 * CREATE / UPDATE AVAILABILITY (Owner/Admin)
 */
export const setAvailability = async (req, res) => {
  try {
    const { is_available, unavailable_from, unavailable_to, reason } = req.body;
    const machineId = req.params.machineId;

    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found"
      });
    }

    // Owner restriction
    if (
      req.user.role === "owner" &&
      machine.owner_id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can manage availability only for your machines"
      });
    }

    let availability = await Availability.findOne({ machine_id: machineId });

    if (!availability) {
      availability = new Availability({
        machine_id: machineId,
        updated_by: req.user.userId
      });
    }

    availability.is_available = is_available;

    if (!is_available) {
      availability.unavailable_from = unavailable_from || null;
      availability.unavailable_to = unavailable_to || null;
      availability.reason = reason || "";
    } else {
      availability.unavailable_from = null;
      availability.unavailable_to = null;
      availability.reason = "";
    }

    availability.updated_by = req.user.userId;

    await availability.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to manage availability",
      error: error.message
    });
  }
};

/**
 * GET MACHINE AVAILABILITY (Public / Farmer)
 */
export const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      machine_id: req.params.machineId
    });

    res.status(200).json({
      success: true,
      data: availability || { is_available: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: error.message
    });
  }
};
