import mongoose from "mongoose";

const orderSchema =
  new mongoose.Schema(

    {

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      medicines: [

        {

          medicineId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Medicine",

          },

          name: String,

          price: Number,

          quantity: Number,

        },

      ],

      totalAmount: {

        type: Number,

        required: true,

      },

      address: {

        type: String,

        required: true,

      },

      paymentStatus: {

        type: String,

        enum: [
          "pending",
          "paid",
        ],

        default: "paid",
      },

      deliveryStatus: {

        type: String,

        enum: [

          "processing",

          "shipped",

          "out for delivery",

          "delivered",

        ],

        default: "processing",
      },

    },

    {
      timestamps: true,
    }
  );

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;