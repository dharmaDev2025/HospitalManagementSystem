import express from "express";
import multer from "multer";
import fs from "fs";

import {
  getDoctorSlots,
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  addPrescription,
  getPatientPrescriptions,
  sendChatMessage,
  getChatMessages,
  createAppointmentCheckout,
  confirmAppointmentPayment,
  uploadChatFile,
} from "../controllers/appointmentController.js";

import {
  protect,
  patientOnly,
  doctorOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= CREATE UPLOAD FOLDER =================

const chatUploadPath = "uploads/chat";

if (!fs.existsSync(chatUploadPath)) {
  fs.mkdirSync(chatUploadPath, {
    recursive: true,
  });
}

// ================= MULTER CONFIG =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, chatUploadPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// ================= SLOTS =================

router.get(
  "/slots/:doctorId",
  getDoctorSlots
);

// ================= STRIPE PAYMENT =================

router.post(
  "/create-checkout",
  protect,
  patientOnly,
  createAppointmentCheckout
);

router.post(
  "/confirm-payment",
  protect,
  patientOnly,
  confirmAppointmentPayment
);

// ================= PATIENT =================

router.post(
  "/book",
  protect,
  patientOnly,
  bookAppointment
);

router.get(
  "/patient/:patientId",
  protect,
  patientOnly,
  getPatientAppointments
);

router.get(
  "/prescriptions/:patientId",
  protect,
  patientOnly,
  getPatientPrescriptions
);

// ================= DOCTOR =================

router.get(
  "/doctor/:doctorId",
  protect,
  doctorOnly,
  getDoctorAppointments
);

router.put(
  "/status/:id",
  protect,
  doctorOnly,
  updateAppointmentStatus
);

router.post(
  "/prescription",
  protect,
  doctorOnly,
  addPrescription
);

// ================= CHAT BOTH USER + DOCTOR =================

router.post(
  "/chat/send",
  protect,
  sendChatMessage
);

router.get(
  "/chat/:appointmentId",
  protect,
  getChatMessages
);

router.post(
  "/chat/upload",
  protect,
  upload.single("file"),
  uploadChatFile
);

export default router;