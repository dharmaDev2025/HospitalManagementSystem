import express from "express";

import {
  addBloodStock,
  getBloodStock,
  requestBlood,
  updateBloodRequestStatus,
  getBloodRequests,
  deleteBloodStock,
  updateBloodStock,
  getMyBloodRequests,
  deleteMyBloodRequest,
} from "../controllers/bloodController.js";

import {
  protect,
  adminOnly,
  patientOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, addBloodStock);
router.get("/requests", protect, adminOnly, getBloodRequests);
router.put("/status/:id", protect, adminOnly, updateBloodRequestStatus);
router.put("/:id", protect, adminOnly, updateBloodStock);
router.delete("/:id", protect, adminOnly, deleteBloodStock);

router.get("/", getBloodStock);
router.post("/request", protect, patientOnly, requestBlood);

router.get(
  "/my-requests/:patientId",
  protect,
  patientOnly,
  getMyBloodRequests
);

router.put(
  "/delete-request/:id",
  protect,
  patientOnly,
  deleteMyBloodRequest
);

export default router;