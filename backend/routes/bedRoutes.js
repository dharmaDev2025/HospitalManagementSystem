import express from "express";

import {
  addBed,
  getBeds,
  bookBed,
  getBedBookings,
  assignBed,
  dischargePatient,
  updateBed,
  deleteBed,
  updateBedStatus
} from "../controllers/bedController.js";

import {
  protect,
  adminOnly,
  patientOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= ADMIN =================

// Add bed
router.post("/add", protect, adminOnly, addBed);

// Get beds
router.get("/", getBeds);

// Book bed (patient)
router.post("/book", protect, patientOnly, bookBed);

// Bookings (admin)
router.get("/bookings", protect, adminOnly, getBedBookings);

// Assign bed
router.put("/assign/:id", protect, adminOnly, assignBed);

// Discharge patient
router.put("/discharge/:id", protect, adminOnly, dischargePatient);

// Update bed
router.put("/:id", protect, adminOnly, updateBed);

// Delete bed
router.delete("/:id", protect, adminOnly, deleteBed);

// Update bed status (NEW FEATURE)
router.put("/status/:id", protect, adminOnly, updateBedStatus);

export default router;