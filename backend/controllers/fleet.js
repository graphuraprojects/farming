import Machine from "../models/Machine.model.js";

export const getFleetList = async (req, res) => {
  try {
    const machines = await Machine.find({
      owner_id: req.user.userId,
      isApproved: true, // ⭐ ONLY APPROVED MACHINES
    }).select("machine_name category model images availability_status");

    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: "Fleet fetch failed" });
  }
};

export const toggleMachineAvailability = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.machineId);

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    if (!machine.isApproved) {
      return res.status(400).json({
        message: "Machine not approved by admin",
      });
    }

    machine.availability_status = !machine.availability_status;
    await machine.save();

    res.json({
      message: "Availability updated",
      availability_status: machine.availability_status,
    });
  } catch (err) {
    res.status(500).json({ message: "Availability update failed" });
  }
};
