import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";

dotenv.config();

import connectDB from "./cofig/db.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import ChatMessage from "./models/ChatMessage.js";

const app = express();

// ================= DATABASE =================

connectDB();

// ================= MIDDLEWARE =================

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Hospital Backend Running");
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/appointments", appointmentRoutes);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ================= DOCTOR / PATIENT CHAT =================

  socket.on("joinAppointment", (appointmentId) => {
    socket.join(appointmentId);
    console.log("Joined appointment room:", appointmentId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const savedMessage = await ChatMessage.create({
        appointmentId: data.appointmentId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
      });

      io.to(data.appointmentId).emit(
        "receiveMessage",
        savedMessage
      );
    } catch (error) {
      console.log(error.message);
    }
  });

  // ================= VIDEO CALL WEBRTC =================

socket.on("call-user", (data) => {
  socket.to(data.appointmentId).emit("incoming-call", data);
});

socket.on("answer-call", (data) => {
  socket.to(data.appointmentId).emit("call-answered", data);
});

socket.on("ice-candidate", (data) => {
  socket.to(data.appointmentId).emit("ice-candidate", data);
});

socket.on("reject-call", (data) => {
  socket.to(data.appointmentId).emit("call-rejected");
});

socket.on("end-call", (data) => {
  socket.to(data.appointmentId).emit("call-ended");
});

  // ================= LAB EXPERT CHAT =================

  socket.on("joinLabBooking", (bookingId) => {
    socket.join(bookingId);
  });

  socket.on("sendLabMessage", (data) => {
    io.to(data.bookingId).emit("receiveLabMessage", {
      bookingId: data.bookingId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      createdAt: new Date(),
    });
  });

  // ================= DISCONNECT =================

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
