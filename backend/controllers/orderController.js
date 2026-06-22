import Order from "../models/Order.js";


// ================= CREATE ORDER =================

export const createOrder =
async (req, res) => {

  try {

    const {

      medicines,

      totalAmount,

      address,

    } = req.body;

    const order =
      await Order.create({

        userId: req.user.id,

        medicines,

        totalAmount,

        address,

        paymentStatus:
          "paid",

      });

    res.status(201).json({

      success: true,

      message:
        "Order Placed",

      order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= USER ORDERS =================

// ================= USER ORDERS =================

export const getUserOrders =
async (req, res) => {

  try {

    const orders =
      await Order.find({

        userId:
          req.params.userId,

      }).sort({

        createdAt: -1,

      });

    res.status(200).json({

      success: true,

      orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= ADMIN ALL ORDERS =================

export const getAllOrders =
async (req, res) => {

  try {

    const orders =
  await Order.find({
    deliveryStatus: {
      $ne: "delivered",
    },
  })
  .populate(
    "userId",
    "name email"
  );

    res.status(200).json({

      success: true,

      orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= UPDATE DELIVERY =================

export const updateDeliveryStatus =
async (req, res) => {

  try {

    const updated =
      await Order.findByIdAndUpdate(

        req.params.id,

        {

          deliveryStatus:
            req.body.deliveryStatus,

        },

        {

          returnDocument:
            "after",

        }
      );

    res.status(200).json({

      success: true,

      message:
        "Delivery Updated",

      order: updated,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};