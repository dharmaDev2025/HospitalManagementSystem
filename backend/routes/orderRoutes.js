import express from "express";

import {

  createOrder,

  getUserOrders,

  getAllOrders,

  updateDeliveryStatus,

} from "../controllers/orderController.js";

import {

  protect,

  adminOnly,

  patientOnly,

} from "../middleware/authMiddleware.js";

const router =
  express.Router();


// CREATE ORDER
router.post(

  "/create",

  protect,

  patientOnly,

  createOrder
);


// USER ORDERS
router.get(

  "/user/:userId",

  protect,

  patientOnly,

  getUserOrders
);


// ADMIN ORDERS
router.get(

  "/all",

  protect,

  adminOnly,

  getAllOrders
);


// UPDATE DELIVERY
router.put(

  "/status/:id",

  protect,

  adminOnly,

  updateDeliveryStatus
);

export default router;