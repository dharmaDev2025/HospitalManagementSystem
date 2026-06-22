import express from "express";

import {
  addInsurance,
  applyClaim,
  getMyClaims,
  getMyInsurances,
  updateClaimStatus,
  getAllClaims,
  deleteMyClaim,
} from "../controllers/insuranceController.js";

import {
  protect,
  adminOnly,
  patientOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// =====================================
// PATIENT
// =====================================

// Upload insurance certificate + ID proof
router.post(
  "/add",
  protect,
  patientOnly,
  upload.fields([
    {
      name: "insuranceCertificate",
      maxCount: 1,
    },
    {
      name: "idProof",
      maxCount: 1,
    },
  ]),
  addInsurance
);

// Get my uploaded insurances
router.get(
  "/my-insurances/:patientId",
  protect,
  patientOnly,
  getMyInsurances
);

// Apply claim with documents
router.post(
  "/claim",
  protect,
  patientOnly,
  upload.array("documents", 5),
  applyClaim
);

// My claims
router.get(
  "/my-claims/:patientId",
  protect,
  patientOnly,
  getMyClaims
);

// Delete claim from user history
router.put(
  "/delete-claim/:id",
  protect,
  patientOnly,
  deleteMyClaim
);


// =====================================
// ADMIN
// =====================================

// Get active claims only
router.get(
  "/all-claims",
  protect,
  adminOnly,
  getAllClaims
);

// Update claim status
router.put(
  "/status/:id",
  protect,
  adminOnly,
  updateClaimStatus
);

export default router;