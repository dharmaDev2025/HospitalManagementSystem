import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

// ==================================================
// GENERATE TOKEN
// ==================================================

const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in Render Environment");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ==================================================
// REGISTER PATIENT
// ==================================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient",
      phone,
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// UPDATE PROFILE
// ==================================================

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// LOGIN
// ==================================================

export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);
    console.log("JWT STATUS:", process.env.JWT_SECRET ? "OK" : "MISSING");

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // ================= ADMIN LOGIN =================

    if (
      email === "admin@gmail.com" &&
      password === "password1234"
    ) {
      if (role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "This account is registered as admin",
        });
      }

      const adminToken = generateToken({
        role: "admin",
      });

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token: adminToken,
        user: {
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
        },
      });
    }

    // ================= NORMAL USER LOGIN =================

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `This account is registered as ${user.role}`,
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: `${user.role} logged in successfully`,
      token,
      user,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==================================================
// FORGOT PASSWORD
// ==================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    await sendMail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}\n\nIt is valid for 5 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// VERIFY OTP
// ==================================================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// RESET PASSWORD
// ==================================================

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
