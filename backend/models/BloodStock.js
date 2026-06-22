import mongoose from "mongoose";

const bloodStockSchema =
  new mongoose.Schema(

    {

      bloodGroup: {

        type: String,

        required: true,
      },

      units: {

        type: Number,

        required: true,
      },

      donorName: {

        type: String,

        required: true,
      },

      expiryDate: {

        type: Date,

        required: true,
      },

      status: {

        type: String,

        enum: [
          "available",
          "expired",
        ],

        default: "available",
      },

    },

    {
      timestamps: true,
    }
  );

const BloodStock =
  mongoose.model(
    "BloodStock",
    bloodStockSchema
  );

export default BloodStock;