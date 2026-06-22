import express from "express";
import multer from "multer";

import {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= MULTER CONFIG =================
const upload = multer({
  storage: multer.memoryStorage(),
});

// ================= ADMIN ROUTES =================

// Add Doctor
router.post(
  "/add",
  protect,
  adminOnly,
  upload.single("image"), // ✅ image upload
  addDoctor
);

// Update Doctor
router.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.single("image"), // ✅ image upload
  updateDoctor
);

// Delete Doctor
router.delete(
  "/delete/:id",
  protect,
  adminOnly,
  deleteDoctor
);

// ================= PUBLIC ROUTE =================

// Get All Doctors
router.get("/", getDoctors);

export default router;