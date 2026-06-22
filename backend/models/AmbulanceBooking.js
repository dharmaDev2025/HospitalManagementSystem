import mongoose from "mongoose";

const ambulanceBookingSchema =
  new mongoose.Schema(

    {

      patientId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },



      ambulanceId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Ambulance",
      },



      pickupLocation: {
        type: String,
      },



      destination: {
        type: String,
      },



      status: {

        type: String,

        enum: [

          "requested",

          "assigned",

          "completed",
        ],

        default: "requested",
      },

    },

    {
      timestamps: true,
    }
  );

const AmbulanceBooking =
  mongoose.model(
    "AmbulanceBooking",
    ambulanceBookingSchema
  );

export default AmbulanceBooking;