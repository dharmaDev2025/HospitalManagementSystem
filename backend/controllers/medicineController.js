import Medicine from "../models/Medicine.js";

import cloudinary
from "../cofig/cloudinary.js";


// ================= ADD =================

export const addMedicine =
async (req, res) => {

  try {

    const {

      name,
      description,
      price,
      stock,
      category,

    } = req.body;

    const file = req.file;

    let imageUrl = "";

    // CLOUDINARY
    if (file) {

      const result =
        await cloudinary.uploader.upload(

          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

          {
            folder: "medicines",
          }
        );

      imageUrl =
        result.secure_url;
    }

    const medicine =
      await Medicine.create({

        name,
        description,
        price,
        stock,
        category,
        image: imageUrl,

      });

    res.status(201).json({

      success: true,

      message:
        "Medicine Added",

      medicine,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= GET =================

export const getMedicines =
async (req, res) => {

  try {

    const medicines =
      await Medicine.find();

    res.status(200).json({

      success: true,

      medicines,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= UPDATE =================

export const updateMedicine =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const medicine =
      await Medicine.findById(id);

    if (!medicine) {

      return res.status(404).json({

        success: false,

        message:
          "Medicine not found",

      });
    }

    let imageUrl =
      medicine.image;

    // NEW IMAGE
    if (req.file) {

      const result =
        await cloudinary.uploader.upload(

          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,

          {
            folder: "medicines",
          }
        );

      imageUrl =
        result.secure_url;
    }

    const updatedMedicine =
      await Medicine.findByIdAndUpdate(

        id,

        {

          ...req.body,

          image: imageUrl,

        },

        {

          returnDocument:
            "after",

        }
      );

    res.status(200).json({

      success: true,

      message:
        "Medicine Updated",

      medicine:
        updatedMedicine,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ================= DELETE =================

export const deleteMedicine =
async (req, res) => {

  try {

    await Medicine.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "Medicine Deleted",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};