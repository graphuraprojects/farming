import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    machine_type: {
      type: String,
      required: true
    },

    price_per_hour: {
      type: Number,
      required: true
    },

    base_location: {
      type: String,
      required: true
    },

    images: [
      {
        type: String // WebP image URLs
      }
    ],

    availability_status: {
      type: Boolean,
      default: true
    },

    isApproved: {
      type: Boolean,
      default: false // Admin approval
    }
  },
  { timestamps: true }
);

export default mongoose.model("Machine", machineSchema);
