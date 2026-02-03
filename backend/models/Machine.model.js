import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // BASIC INFO
    machine_name: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    model_year: {
      type: Number,
      required: true
    },

    registration_no: {
      type: String,
      required: true,
      unique: true
    },

    // TECHNICAL
    fuel_type: {
      type: String,
      enum: ["Diesel", "Petrol", "Electric", "Hybrid"],
      required: true
    },

    category: {
      type: String,
      required: true
    },

    // PRICING
    price_per_hour: {
      type: Number,
      required: true
    },

    // LOCATION
    location: {
      latitude: Number,
      longitude: Number
    },

    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
  
    images: [
  {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }
],

documents: {
  ownership_proof: {
    url: String,
    public_id: String
  }
},
  
    availability_status: {
      type: Boolean,
      default: true
    },

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Machine", machineSchema);
