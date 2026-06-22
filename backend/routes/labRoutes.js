import express from "express";

import {
  addLabExpert,
  getLabExperts,
  updateLabExpert,
  deleteLabExpert,

  addLabTest,
  getAllLabTests,
  updateLabTest,
  deleteLabTest,

  getAvailableTests,
  bookTestSlot,
  getPatientBookings,
  getExpertBookings,
  updateBookingStatus,
  uploadReport,
  generateLabReport,
  getPatientReports,
} from "../controllers/labController.js";

import {
  protect,
  adminOnly,
  patientOnly,
  labExpertOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= ADMIN LAB EXPERT ROUTES =================

router.post(
  "/add-expert",
  protect,
  adminOnly,
  addLabExpert
);

router.get(
  "/experts",
  protect,
  adminOnly,
  getLabExperts
);

router.put(
  "/update-expert/:id",
  protect,
  adminOnly,
  updateLabExpert
);

router.delete(
  "/delete-expert/:id",
  protect,
  adminOnly,
  deleteLabExpert
);

// ================= ADMIN TEST ROUTES =================

router.post(
  "/add-test",
  protect,
  adminOnly,
  addLabTest
);

router.get(
  "/all-tests",
  protect,
  adminOnly,
  getAllLabTests
);

router.put(
  "/update-test/:id",
  protect,
  adminOnly,
  updateLabTest
);

router.delete(
  "/delete-test/:id",
  protect,
  adminOnly,
  deleteLabTest
);

// ================= PATIENT ROUTES =================

router.get(
  "/tests",
  getAvailableTests
);

router.post(
  "/book-test",
  protect,
  patientOnly,
  bookTestSlot
);

router.get(
  "/bookings/:patientId",
  protect,
  patientOnly,
  getPatientBookings
);

router.get(
  "/reports/:patientId",
  protect,
  patientOnly,
  getPatientReports
);

// ================= LAB EXPERT ROUTES =================

router.get(
  "/expert-bookings/:expertId",
  protect,
  labExpertOnly,
  getExpertBookings
);

router.put(
  "/booking-status/:id",
  protect,
  labExpertOnly,
  updateBookingStatus
);

router.post(
  "/generate-report",
  protect,
  labExpertOnly,
  generateLabReport
);

router.post(
  "/upload-report",
  protect,
  labExpertOnly,
  upload.single("reportFile"),
  uploadReport
);

export default router;