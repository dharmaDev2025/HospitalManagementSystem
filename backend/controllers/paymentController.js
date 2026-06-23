import Stripe from "stripe";

import Order from "../models/Order.js";
import BedBooking from "../models/BedBooking.js";


// ================= MEDICINE CHECKOUT =================

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe =
      new Stripe(process.env.STRIPE_SECRET_KEY);

    const {
      medicines,
      userId,
      address,
    } = req.body;

    const totalAmount =
      medicines.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    const order =
      await Order.create({
        userId,
        medicines,
        totalAmount,
        address,
        paymentStatus: "paid",
        deliveryStatus: "processing",
      });

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items:
          medicines.map((item) => ({
            price_data: {
              currency: "inr",

              product_data: {
                name: item.name,
              },

              unit_amount:
                Number(item.price) * 100,
            },

            quantity:
              Number(item.quantity),
          })),

        metadata: {
          orderId: order._id.toString(),
          userId,
        },

        success_url:
          `${process.env.FRONTEND_URL}/medicines`,

        cancel_url:
        `${process.env.FRONTEND_URL}/medicines`,
      });

    res.status(200).json({
      success: true,
      url: session.url,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= BED CHECKOUT =================

export const createBedCheckoutSession = async (req, res) => {
  try {
    const stripe =
      new Stripe(process.env.STRIPE_SECRET_KEY);

    const {
      userId,
      bedId,
      bedNumber,
      bedType,
      totalAmount,
    } = req.body;

    const booking =
      await BedBooking.create({
        patientId: userId,
        bedId,
        paymentStatus: "paid",
        totalAmount,
        bookingStatus: "pending",
      });

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "inr",

              product_data: {
                name:
                  `Bed ${bedNumber} - ${bedType}`,
              },

              unit_amount:
                Number(totalAmount) * 100,
            },

            quantity: 1,
          },
        ],

        metadata: {
          bookingId:
            booking._id.toString(),

          userId,
          bedId,
        },

        success_url:
         `${process.env.FRONTEND_URL}/bed-booking`,

        cancel_url:
       `${process.env.FRONTEND_URL}/bed-booking`,
      });

    res.status(200).json({
      success: true,
      url: session.url,
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
