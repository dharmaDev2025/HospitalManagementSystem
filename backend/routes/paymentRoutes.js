import express from "express";

import {
  createCheckoutSession,createBedCheckoutSession
} from "../controllers/paymentController.js";

import {
  protect,
  patientOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/checkout",
  protect,
  patientOnly,
  createCheckoutSession
);

router.post(
  "/bed-checkout",
  protect,
  patientOnly,
  createBedCheckoutSession
);
export default router;