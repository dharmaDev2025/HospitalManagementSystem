import mongoose from "mongoose";

const bedSchema =
  new mongoose.Schema(

    {

      bedNumber: {

        type: String,

        required: true,

        unique: true,
      },

      wardType: {

        type: String,

        enum: [

          "general",

          "ICU",

          "emergency",

          "maternity",

          "children",
        ],

        default: "general",
      },

      roomNumber: {

        type: String,

        required: true,
      },

      floor: {

        type: Number,

        default: 1,
      },

      bedType: {

        type: String,

        enum: [

          "general",

          "private",

          "ICU",
        ],

        required: true,
      },

      status: {

        type: String,

        enum: [

          "vacant",

          "occupied",

          "reserved",

          "cleaning",

          "maintenance",
        ],

        default: "vacant",
      },

      notes: {

        type: String,

        default: "",
      },

    },

    {
      timestamps: true,
    }
  );

const Bed =
  mongoose.model(
    "Bed",
    bedSchema
  );

export default Bed;