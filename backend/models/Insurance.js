import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    providerName: {
      type: String,
      required: true,
    },

    policyNumber: {
      type: String,
      required: true,
      unique: true,
    },

    coverageAmount: {
      type: Number,
      required: true,
    },

    expiryDate: {
      type: String,
      required: true,
    },

    insuranceCertificate: {
  type: String,
  required: true,
},

idProof: {
  type: String,
  required: true,
},

ocrText: {
  type: String,
  default: "",
},

    aiVerificationStatus: {
      type: String,
      enum: [
        "pending",
        "verified",
        "suspicious",
        "rejected",
      ],
      default: "pending",
    },

    aiConfidenceScore: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Insurance = mongoose.model(
  "Insurance",
  insuranceSchema
);

export default Insurance;