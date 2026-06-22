import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    treatmentType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    appointmentDate: {
      type: String,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "booked",
        "pending",
        "accepted",
        "rejected",
        "completed",
      ],
      default: "pending",
    },

    chatEnabled: {
      type: Boolean,
      default: false,
    },
    stripeSessionId: {
  type: String,
  default: "",
},
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);