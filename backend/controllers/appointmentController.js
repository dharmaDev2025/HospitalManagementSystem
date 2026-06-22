import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Prescription from "../models/Prescription.js";
import ChatMessage from "../models/ChatMessage.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const onlineSlots = [
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const offlineSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "16:00",
  "16:30",
  "17:00",
];

const getNextThreeDates = () => {
  const dates = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

// ================= GET SLOTS =================

export const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { treatmentType, appointmentDate } = req.query;

    const slots =
      treatmentType === "online"
        ? onlineSlots
        : offlineSlots;

    const booked = await Appointment.find({
      doctorId,
      appointmentDate,
      appointmentTime: { $in: slots },
      status: { $ne: "rejected" },
    });

    const bookedSlots = booked.map(
      (item) => item.appointmentTime
    );

    const availableSlots = slots.map((slot) => ({
      time: slot,
      booked: bookedSlots.includes(slot),
    }));

    res.status(200).json({
      success: true,
      dates: getNextThreeDates(),
      slots: availableSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAppointmentCheckout = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      treatmentType,
      appointmentDate,
      appointmentTime,
    } = req.body;

    const doctor = await Doctor.findById(doctorId).populate(
      "userId",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const alreadyBooked = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: "rejected" },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${doctor.userId?.name} - ${treatmentType} consultation`,
              description: `${appointmentDate} at ${appointmentTime}`,
            },
            unit_amount: Number(doctor.fees) * 100,
          },
          quantity: 1,
        },
      ],
success_url: `${process.env.FRONTEND_URL}/my-appointments?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.FRONTEND_URL}/book-appointment`,

      metadata: {
        patientId,
        doctorId,
        treatmentType,
        appointmentDate,
        appointmentTime,
        fees: doctor.fees,
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const confirmAppointmentPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const {
      patientId,
      doctorId,
      treatmentType,
      appointmentDate,
      appointmentTime,
      fees,
    } = session.metadata;

    const existing = await Appointment.findOne({
      stripeSessionId: sessionId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Appointment already confirmed",
        appointment: existing,
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      treatmentType,
      appointmentDate,
      appointmentTime,
      fees,
      paymentStatus: "paid",
      stripeSessionId: sessionId,
      status: treatmentType === "online" ? "booked" : "pending",
      chatEnabled: treatmentType === "online",
    });

    res.status(201).json({
      success: true,
      message: "Payment successful and appointment booked",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= PATIENT BOOK APPOINTMENT =================

export const bookAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      treatmentType,
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (
      !patientId ||
      !doctorId ||
      !treatmentType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (
      treatmentType === "online" &&
      !onlineSlots.includes(appointmentTime)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Online treatment slot allowed only from 7 PM to 10 PM",
      });
    }

    if (treatmentType === "offline") {
      const allowedDates = getNextThreeDates();

      if (!allowedDates.includes(appointmentDate)) {
        return res.status(400).json({
          success: false,
          message:
            "Offline treatment booking allowed only for next 3 days",
        });
      }

      if (!offlineSlots.includes(appointmentTime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid offline slot",
        });
      }
    }

    const alreadyBooked = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: "rejected" },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      treatmentType,
      appointmentDate,
      appointmentTime,
      fees: doctor.fees,
      paymentStatus: "paid",
      status:
        treatmentType === "online"
          ? "booked"
          : "pending",
      chatEnabled:
        treatmentType === "online"
          ? true
          : false,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= PATIENT APPOINTMENTS =================

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DOCTOR APPOINTMENTS =================

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
    })
      .populate("patientId", "name email phone")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DOCTOR UPDATE STATUS =================

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DOCTOR ADD PRESCRIPTION =================

// ================= DOCTOR ADD PRESCRIPTION =================

export const addPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      patientId,
      medicines,
      dosage,
      advice,
    } = req.body;

    if (
      !appointmentId ||
      !doctorId ||
      !patientId ||
      !medicines ||
      !advice
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const prescription = await Prescription.create({
      appointmentId,
      doctorId,
      patientId,
      medicines,
      dosage,
      advice,
    });

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Prescription added successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= PATIENT PRESCRIPTIONS =================

// ================= PATIENT PRESCRIPTIONS =================

export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    })
      .populate("patientId", "name email phone")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const uploadChatFile = async (req, res) => {
  try {
    const {
      appointmentId,
      senderId,
      receiverId,
      message,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const fileUrl = `/uploads/chat/${req.file.filename}`;

    let fileType = "file";

    if (req.file.mimetype.startsWith("image")) {
      fileType = "image";
    } else if (req.file.mimetype === "application/pdf") {
      fileType = "pdf";
    }

    const chat = await ChatMessage.create({
      appointmentId,
      senderId,
      receiverId,
      message: message || "",
      fileUrl,
      fileType,
      fileName: req.file.originalname,
    });

    res.status(201).json({
      success: true,
      message: "File sent successfully",
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= SEND CHAT MESSAGE =================

export const sendChatMessage = async (req, res) => {
  try {
    const {
      appointmentId,
      senderId,
      receiverId,
      message,
    } = req.body;

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (!appointment.chatEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "Chat is available only for online appointments",
      });
    }

    const chat = await ChatMessage.create({
      appointmentId,
      senderId,
      receiverId,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent",
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET CHAT MESSAGES =================

export const getChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      appointmentId: req.params.appointmentId,
    })
      .populate("senderId", "name role")
      .populate("receiverId", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};