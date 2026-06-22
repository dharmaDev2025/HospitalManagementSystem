import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    qualification: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },

    about: {
      type: String,
      default: "",
    },

    // ✅ NEW FIELD
    image: {
      type: String, // Cloudinary URL
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);