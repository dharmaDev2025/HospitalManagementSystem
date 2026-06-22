import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    unitsNeeded: {
      type: Number,
      required: true,
    },

    approvedUnits: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isDeletedByUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);