import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      required: true,
    },

    claimAmount: {
      type: Number,
      required: true,
    },

    hospitalBill: {
      type: Number,
      required: true,
    },

    documents: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    adminRemarks: {
      type: String,
      default: "",
    },

    isDeletedByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const InsuranceClaim = mongoose.model(
  "InsuranceClaim",
  insuranceClaimSchema
);

export default InsuranceClaim;