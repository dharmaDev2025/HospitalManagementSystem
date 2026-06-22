import mongoose from "mongoose";

const bedBookingSchema =
  new mongoose.Schema(

    {

      patientId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      bedId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Bed",

        required: true,
      },

      assignedDoctor: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        default: null,
      },

      paymentStatus: {

        type: String,

        enum: [

          "pending",

          "paid",

          "failed",
        ],

        default: "pending",
      },

      bookingStatus: {

        type: String,

        enum: [

          "pending",

          "approved",

          "assigned",

          "completed",

          "cancelled",
        ],

        default: "pending",
      },

      admissionDate: {

        type: Date,

        default: null,
      },

      dischargeDate: {

        type: Date,

        default: null,
      },

      totalAmount: {

        type: Number,

        default: 0,
      },

      remarks: {

        type: String,

        default: "",
      },

    },

    {
      timestamps: true,
    }
  );

const BedBooking =
  mongoose.model(
    "BedBooking",
    bedBookingSchema
  );

export default BedBooking;