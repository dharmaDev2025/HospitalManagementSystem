import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import LabTest from "../models/LabTest.js";
import TestBooking from "../models/TestBooking.js";
import LabReport from "../models/LabReport.js";


// ==================================================
// ADMIN ADD LAB EXPERT
// ==================================================

export const addLabExpert = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Lab expert already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const expert = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "labExpert",
    });

    res.status(201).json({
      success: true,
      message: "Lab expert added",
      expert,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN GET LAB EXPERTS
// ==================================================

export const getLabExperts = async (req, res) => {
  try {
    const experts = await User.find({
      role: "labExpert",
    }).select("-password");

    res.status(200).json({
      success: true,
      experts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN UPDATE LAB EXPERT
// ==================================================

export const updateLabExpert = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const expert = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Lab expert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lab expert updated",
      expert,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN DELETE LAB EXPERT
// ==================================================

export const deleteLabExpert = async (req, res) => {
  try {
    const expert = await User.findByIdAndDelete(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Lab expert not found",
      });
    }

    await LabTest.deleteMany({
      expertId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Lab expert deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN ADD NEW TEST
// ==================================================

export const addLabTest = async (req, res) => {
  try {
    const {
      testName,
      price,
      expertId,
    } = req.body;

    const existingTest = await LabTest.findOne({
      testName,
    });

    if (existingTest) {
      return res.status(400).json({
        success: false,
        message: "Test already exists",
      });
    }

    const test = await LabTest.create({
      testName,
      price,
      expertId,
    });

    res.status(201).json({
      success: true,
      message: "New lab test added",
      test,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN GET ALL TESTS
// ==================================================

export const getAllLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find()
      .populate("expertId", "name email phone");

    res.status(200).json({
      success: true,
      tests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN UPDATE TEST
// ==================================================

export const updateLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("expertId", "name email phone");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lab test updated",
      test,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// ADMIN DELETE TEST
// ==================================================

export const deleteLabTest = async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    await LabTest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lab test deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// PATIENT GET AVAILABLE TESTS
// ==================================================

export const getAvailableTests = async (req, res) => {
  try {
    const tests = await LabTest.find()
      .populate("expertId", "name email");

    res.status(200).json({
      success: true,
      tests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// PATIENT BOOK TEST SLOT
// ==================================================

export const bookTestSlot = async (req, res) => {
  try {
    const {
      patientId,
      tests,
      bookingDate,
      bookingTime,
    } = req.body;

    const booking = await TestBooking.create({
      patientId,
      tests,
      bookingDate,
      bookingTime,
    });

    res.status(201).json({
      success: true,
      message: "Lab test booked successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// PATIENT VIEW BOOKINGS
// ==================================================

export const getPatientBookings = async (req, res) => {
  try {
    const bookings = await TestBooking.find({
      patientId: req.params.patientId,
    })
      .populate("tests")
      .populate("patientId", "name email phone");

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


// ==================================================
// LAB EXPERT VIEW ASSIGNED BOOKINGS
// ==================================================

export const getExpertBookings = async (req, res) => {
  try {
    const tests = await LabTest.find({
      expertId: req.params.expertId,
    });

    const testIds = tests.map((test) => test._id);

    const bookings = await TestBooking.find({
      tests: {
        $in: testIds,
      },
    })
      .populate("patientId", "name email phone")
      .populate("tests");

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


// ==================================================
// LAB EXPERT UPDATE BOOKING STATUS
// ==================================================

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await TestBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// GENERATE PDF
// ==================================================

const generateReportPdf = async ({
  booking,
  patient,
  reportDetails,
}) => {
  const reportsDir = path.join(
    process.cwd(),
    "uploads",
    "reports"
  );

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, {
      recursive: true,
    });
  }

  const fileName = `report-${Date.now()}.pdf`;
  const filePath = path.join(reportsDir, fileName);

  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  doc.pipe(fs.createWriteStream(filePath));

  // Header background
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill("#2563eb");

  doc
    .fillColor("white")
    .fontSize(24)
    .text("ABC HOSPITAL", 50, 25);

  doc
    .fontSize(14)
    .text("Professional Laboratory Report", 50, 58);

  doc
    .fillColor("#111827")
    .fontSize(18)
    .text("Patient Information", 50, 130);

  // Patient info box
  doc
    .roundedRect(50, 160, 500, 120, 10)
    .fill("#eef2ff");

  doc
    .fillColor("#111827")
    .fontSize(12)
    .text(`Patient Name: ${patient?.name || "Patient"}`, 70, 180)
    .text(`Email: ${patient?.email || "N/A"}`, 70, 205)
    .text(`Booking ID: ${booking._id}`, 70, 230)
    .text(`Report Date: ${new Date().toLocaleDateString()}`, 70, 255);

  doc
    .fillColor("#2563eb")
    .fontSize(18)
    .text("Test Details", 50, 315);

  doc
    .roundedRect(50, 345, 500, 80, 10)
    .fill("#ecfeff");

  doc
    .fillColor("#111827")
    .fontSize(12)
    .text(
      `Tests: ${
        booking.tests
          ?.map((test) => test.testName)
          .join(", ") || "Lab Test"
      }`,
      70,
      370
    )
    .text(`Status: Completed`, 70, 395);

  doc
    .fillColor("#16a34a")
    .fontSize(18)
    .text("Report Result", 50, 465);

  doc
    .roundedRect(50, 495, 500, 180, 10)
    .fill("#f0fdf4");

  doc
    .fillColor("#111827")
    .fontSize(12)
    .text(reportDetails, 70, 520, {
      width: 460,
      lineGap: 6,
    });

  // Footer
  doc
    .moveTo(50, 735)
    .lineTo(550, 735)
    .strokeColor("#d1d5db")
    .stroke();

  doc
    .fillColor("#6b7280")
    .fontSize(10)
    .text(
      "This is a computer generated lab report.",
      50,
      750,
      { align: "center", width: 500 }
    );

  doc.end();

  return `/uploads/reports/${fileName}`;
};


// ==================================================
// SEND MAIL
// ==================================================

const sendReportMail = async ({
  to,
  filePath,
}) => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !to
  ) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Lab Report is Ready",
    text: "Your lab report has been generated and attached.",
    attachments: [
      {
        filename: "lab-report.pdf",
        path: path.join(process.cwd(), filePath),
      },
    ],
  });
};


// ==================================================
// LAB EXPERT GENERATE REPORT
// ==================================================

export const generateLabReport = async (req, res) => {
  try {
    const {
      bookingId,
      patientId,
      uploadedBy,
      reportDetails,
    } = req.body;

    const booking = await TestBooking.findById(bookingId)
      .populate("patientId", "name email phone")
      .populate("tests");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const pdfPath = await generateReportPdf({
      booking,
      patient: booking.patientId,
      reportDetails,
    });

    const report = await LabReport.create({
      bookingId,
      patientId,
      uploadedBy,
      reportDetails,
      reportFile: pdfPath,
    });

    await TestBooking.findByIdAndUpdate(
      bookingId,
      {
        reportUploaded: true,
        status: "completed",
      }
    );

    await sendReportMail({
      to: booking.patientId?.email,
      filePath: pdfPath,
    });

    res.status(201).json({
      success: true,
      message: "Report generated and sent to patient",
      report,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// LAB EXPERT UPLOAD PDF REPORT
// ==================================================

export const uploadReport = async (req, res) => {
  try {
    const {
      bookingId,
      patientId,
      uploadedBy,
      reportDetails,
    } = req.body;

    const report = await LabReport.create({
      bookingId,
      patientId,
      uploadedBy,
      reportDetails,
      reportFile: req.file.path,
    });

    await TestBooking.findByIdAndUpdate(
      bookingId,
      {
        reportUploaded: true,
        status: "completed",
      }
    );

    res.status(201).json({
      success: true,
      message: "PDF report uploaded successfully",
      report,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==================================================
// PATIENT VIEW REPORTS
// ==================================================

export const getPatientReports = async (req, res) => {
  try {
    const reports = await LabReport.find({
      patientId: req.params.patientId,
    })
      .populate("uploadedBy", "name")
      .populate("bookingId");

    res.status(200).json({
      success: true,
      reports,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};