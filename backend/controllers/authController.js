import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// ==================================================
// REGISTER PATIENT
// ==================================================

export const registerUser = async (req, res) => {

  try {

    const {

      name,
      email,
      password,
      phone,

    } = req.body;



    // Check existing user

    const userExists =
      await User.findOne({ email });



    if (userExists) {

      return res.status(400).json({

        success: false,

        message:
          "User already exists",

      });

    }



    // Hash Password

    const hashedPassword =
      await bcrypt.hash(password, 10);



    // Create Patient Only

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        role: "patient",

        phone,

      });



    // Generate JWT Token

    const token = jwt.sign(

      {

        id: user._id,

        role: user.role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }
    );



    // Response

    res.status(201).json({

      success: true,

      message:
        "Patient registered successfully",

      token,

      user,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
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

    const {

      email,
      password,
      role,

    } = req.body;

    // ================= VALIDATION =================

    if (!email || !password || !role) {

      return res.status(400).json({

        success: false,

        message: "Please fill all fields",

      });
    }



    // ==================================================
    // ADMIN LOGIN
    // ==================================================

    if (

      email === "admin@gmail.com" &&

      password === "password1234"

    ) {

      // ✅ ROLE CHECK

      if (role !== "admin") {

        return res.status(400).json({

          success: false,

          message:
            "This account is registered as admin",

        });
      }

      const adminToken =
        jwt.sign(

          {

            role: "admin",

          },

          process.env.JWT_SECRET,

          {

            expiresIn: "7d",

          }
        );



      return res.status(200).json({

        success: true,

        message:
          "Admin logged in successfully",

        token: adminToken,

        user: {

          name: "Admin",

          email:
            "admin@gmail.com",

          role: "admin",

        },

      });

    }



    // ==================================================
    // NORMAL USER LOGIN
    // ==================================================

    // Find User

    const user =
      await User.findOne({

        email,

      });



    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Email or Password",

      });

    }



    // Compare Password

    const isMatch =
      await bcrypt.compare(

        password,

        user.password
      );



    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Email or Password",

      });

    }



    // ✅ ROLE CHECK

    if (user.role !== role) {

      return res.status(400).json({

        success: false,

        message:
          `This account is registered as ${user.role}`,

      });

    }



    // Generate JWT Token

    const token = jwt.sign(

      {

        id: user._id,

        role: user.role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }
    );



    // Response

    res.status(200).json({

      success: true,

      message:
        `${user.role} logged in successfully`,

      token,

      user,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};