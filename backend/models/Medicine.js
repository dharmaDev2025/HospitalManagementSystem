import mongoose from "mongoose";

const medicineSchema =
  new mongoose.Schema(

    {

      name: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },

      price: {
        type: Number,
        required: true,
      },

      stock: {
        type: Number,
        default: 0,
      },

      image: {
        type: String,
      },

      category: {
        type: String,
      },

    },

    {
      timestamps: true,
    }
  );

const Medicine =
  mongoose.model(
    "Medicine",
    medicineSchema
  );

export default Medicine;