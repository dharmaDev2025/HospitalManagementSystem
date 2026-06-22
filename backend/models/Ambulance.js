import mongoose from "mongoose";

const ambulanceSchema =
  new mongoose.Schema(

    {

      ambulanceNumber: {

        type: String,

        required: true,
      },



      driverName: {

        type: String,

        required: true,
      },



      driverPhone: {

        type: String,

        required: true,
      },



      status: {

        type: String,

        enum: [

          "available",

          "busy",

        ],

        default: "available",
      },

    },

    {
      timestamps: true,
    }
  );

const Ambulance =
  mongoose.model(
    "Ambulance",
    ambulanceSchema
  );

export default Ambulance;