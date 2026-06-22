import Ambulance from "../models/Ambulance.js";
import AmbulanceBooking from "../models/AmbulanceBooking.js";

// ==========================================
// ADD AMBULANCE
// ==========================================
export const addAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.create(req.body);

    res.status(201).json({
      success: true,
      ambulance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL AMBULANCES
// ==========================================
export const getAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find();

    res.status(200).json({
      success: true,
      ambulances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// REQUEST AMBULANCE
// ==========================================
export const requestAmbulance = async (req, res) => {
  try {
    const booking = await AmbulanceBooking.create({
      patientId: req.body.patientId,
      ambulanceId: req.body.ambulanceId,
      pickupLocation: req.body.pickupLocation,
      destination: req.body.destination,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE BOOKING STATUS
// assigned => ambulance busy
// completed => ambulance available
// ==========================================
export const updateAmbulanceStatus = async (req, res) => {
  try {
    const booking = await AmbulanceBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.body.status === "assigned") {
      await Ambulance.findByIdAndUpdate(booking.ambulanceId, {
        status: "busy",
      });
    }

    if (req.body.status === "completed") {
      await Ambulance.findByIdAndUpdate(booking.ambulanceId, {
        status: "available",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL BOOKINGS FOR ADMIN
// completed requests hidden
// ==========================================
export const getAmbulanceBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find({
      status: {
        $ne: "completed",
      },
    })
      .populate("patientId", "name email")
      .populate("ambulanceId")
      .sort({
        createdAt: -1,
      });

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

// ==========================================
// GET USER AMBULANCE BOOKINGS
// ==========================================
export const getMyAmbulanceBookings = async (req, res) => {
  try {

    const bookings =
      await AmbulanceBooking.find({

        patientId: req.params.patientId,

        status: {
          $ne: "completed",
        },

      })

      .populate("ambulanceId")

      .sort({
        createdAt: -1,
      });

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

// ==========================================
// UPDATE AMBULANCE
// ==========================================
export const updateAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      ambulance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE AMBULANCE
// ==========================================
export const deleteAmbulance = async (req, res) => {
  try {
    await Ambulance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ambulance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};