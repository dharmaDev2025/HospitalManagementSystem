import mongoose from "mongoose";

const testBookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabTest",
        required: true,
      },
    ],

    bookingDate: {
      type: String,
      required: true,
    },

    bookingTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "sample_collected", "processing", "completed", "cancelled"],
      default: "pending",
    },

    reportUploaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestBooking", testBookingSchema);