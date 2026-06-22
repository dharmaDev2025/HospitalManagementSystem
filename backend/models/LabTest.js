import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
    },

    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LabTest", labTestSchema);