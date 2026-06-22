import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import cloudinary from "../cofig/cloudinary.js";

// ================= ADD DOCTOR =================
export const addDoctor = async (req, res) => {
  try {
    const file = req.file;

    const {
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      fees,
      qualification,
      about,
    } = req.body;

    if (!name || !email || !password || !specialization || !experience || !fees) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      phone,
    });

    // ================= CLOUDINARY UPLOAD =================
    let imageUrl = "";

    if (file && file.buffer) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "doctors" }
      );

      imageUrl = result.secure_url;
    }

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience: Number(experience),
      fees: Number(fees),
      qualification,
      about,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET DOCTORS =================
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email phone");

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE DOCTOR =================
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    const {
      specialization,
      experience,
      fees,
      qualification,
      about,
      name,
      phone,
    } = req.body;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    let imageUrl = doctor.image;

    if (file && file.buffer) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "doctors" }
      );

      imageUrl = result.secure_url;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        specialization,
        experience,
        fees,
        qualification,
        about,
        image: imageUrl,
      },
      { new: true }
    );

    if (doctor.userId) {
      await User.findByIdAndUpdate(doctor.userId, {
        name,
        phone,
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE DOCTOR =================
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const sendChatMessage = async (req, res) => {
  try {
    const {
      appointmentId,
      senderId,
      receiverId,
      message,
    } = req.body;

    if (!appointmentId || !senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "All chat fields are required",
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