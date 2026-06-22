import multer from "multer";

// ================= STORAGE =================

const storage = multer.diskStorage({

  destination: function (
    req,
    file,
    cb
  ) {

    cb(
      null,
      "uploads/"
    );

  },

  filename: function (
    req,
    file,
    cb
  ) {

    cb(
      null,
      Date.now() +
      "-" +
      file.originalname
    );

  },

});

// ================= FILE FILTER =================

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [

    "application/pdf",

    "image/jpeg",

    "image/jpg",

    "image/png",

  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PDF, JPG, JPEG and PNG files are allowed"
      ),
      false
    );

  }

};

// ================= MULTER =================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      10 * 1024 * 1024, // 10MB

  },

});

export default upload;