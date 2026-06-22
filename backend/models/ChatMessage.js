import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);