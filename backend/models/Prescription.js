import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicines: {
      type: String,
      required: true,
    },

    dosage: {
      type: String,
      default: "",
    },

    advice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);