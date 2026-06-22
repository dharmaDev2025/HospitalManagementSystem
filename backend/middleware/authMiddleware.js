// ================= CHECK LOGIN =================

export const protect = async (req, res, next) => {
  try {

    // Temporary Simple Authentication

    const role = req.headers.role;

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    req.user = {
      role,
    };

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ================= ADMIN ONLY =================

export const adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};
// ================= DOCTOR ONLY =================

export const doctorOnly = (
  req,
  res,
  next
) => {

  if (req.user.role !== "doctor") {

    return res.status(403).json({
      success: false,
      message: "Doctor access only",
    });

  }

  next();
};



// ================= PATIENT ONLY =================

export const patientOnly = (
  req,
  res,
  next
) => {

  if (req.user.role !== "patient") {

    return res.status(403).json({
      success: false,
      message: "Patient access only",
    });

  }

  next();
};

// ================= LAB EXPERT ONLY =================

export const labExpertOnly = (
  req,
  res,
  next
) => {

  if (
    req.user.role !==
    "labExpert"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Lab expert access only",

    });

  }



  next();
};
