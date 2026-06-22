import Bed from "../models/Bed.js";
import BedBooking from "../models/BedBooking.js";


// ==========================
// ADD BED
// ==========================
export const addBed = async (req, res) => {
  try {
    const bed = await Bed.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bed Added",
      bed,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// GET ALL BEDS
// ==========================
export const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find();

    res.status(200).json({
      success: true,
      beds,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// BOOK BED (PATIENT)
// ==========================
export const bookBed = async (req, res) => {
  try {
    const booking = await BedBooking.create({
      patientId: req.body.patientId,
      bedId: req.body.bedId,
      paymentStatus: req.body.paymentStatus,
      totalAmount: req.body.totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Bed Booking Requested",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// GET BOOKINGS (ADMIN)
// ==========================
export const getBedBookings = async (req, res) => {
  try {
    const bookings = await BedBooking.find()
      .populate("patientId", "name email")
      .populate("bedId");

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// ASSIGN BED (ADMIN)
// ==========================
export const assignBed = async (req, res) => {
  try {
    const booking = await BedBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    booking.bookingStatus = "assigned";
    booking.admissionDate = new Date();

    await booking.save();

    await Bed.findByIdAndUpdate(booking.bedId, {
      status: "occupied",
      patientId: booking.patientId,
    });

    res.status(200).json({
      success: true,
      message: "Bed Assigned Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// DISCHARGE PATIENT (ADMIN)
// ==========================
export const dischargePatient = async (req, res) => {
  try {
    const booking = await BedBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.bookingStatus = "completed";
    booking.dischargeDate = new Date();

    await booking.save();

    await Bed.findByIdAndUpdate(booking.bedId, {
      status: "vacant",
      patientId: null,
    });

    res.status(200).json({
      success: true,
      message: "Patient Discharged",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// UPDATE BED DETAILS
// ==========================
export const updateBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bed Updated",
      bed,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// DELETE BED
// ==========================
export const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bed Deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// UPDATE BED STATUS (NEW)
// ==========================
export const updateBedStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bed status updated",
      bed,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};