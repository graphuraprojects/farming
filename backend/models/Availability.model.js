import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    machine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
      unique: true
    },

    is_available: {
      type: Boolean,
      default: true
    },

    unavailable_from: {
      type: Date,
      default: null
    },

    unavailable_to: {
      type: Date,
      default: null
    },

    reason: {
      type: String,
      default: ""
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);
