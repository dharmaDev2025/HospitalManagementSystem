import express from "express";

import {

  addAmbulance,

  getAmbulances,

  requestAmbulance,

  updateAmbulanceStatus,

  getAmbulanceBookings,

  updateAmbulance,

  deleteAmbulance,
  getMyAmbulanceBookings,

} from "../controllers/ambulanceController.js";

import {

  protect,

  adminOnly,

  patientOnly,

} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// ADMIN ROUTES
// ==========================================


// ADD AMBULANCE
router.post(

  "/add",

  protect,

  adminOnly,

  addAmbulance

);


// GET ALL AMBULANCES
router.get(

  "/",

  getAmbulances

);


// GET ALL BOOKINGS
router.get(

  "/bookings",

  protect,

  adminOnly,

  getAmbulanceBookings

);


// UPDATE BOOKING STATUS
router.put(

  "/status/:id",

  protect,

  
  updateAmbulanceStatus

);


// UPDATE AMBULANCE
router.put(

  "/update/:id",

  protect,

  adminOnly,

  updateAmbulance

);


// DELETE AMBULANCE
router.delete(

  "/delete/:id",

  protect,

  adminOnly,

  deleteAmbulance

);


// ==========================================
// PATIENT ROUTES
// ==========================================


// REQUEST AMBULANCE
router.post(

  "/request",

  protect,

  patientOnly,

  requestAmbulance

);
router.get(
  "/my-bookings/:patientId",
  protect,
  patientOnly,
  getMyAmbulanceBookings
);


export default router;