import BloodStock from "../models/BloodStock.js";
import BloodRequest from "../models/BloodRequest.js";
import sendMail from "../utils/sendMail.js";

const removeExpiredBlood = async () => {
  const today = new Date();

  await BloodStock.updateMany(
    { expiryDate: { $lt: today } },
    { status: "expired" }
  );
};

export const addBloodStock = async (req, res) => {
  try {
    const blood = await BloodStock.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blood stock added",
      blood,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBloodStock = async (req, res) => {
  try {
    await removeExpiredBlood();

    const bloodStock = await BloodStock.find({
      status: "available",
    });

    res.status(200).json({
      success: true,
      bloodStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBloodStock = async (req, res) => {
  try {
    const blood = await BloodStock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!blood) {
      return res.status(404).json({
        success: false,
        message: "Blood stock not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blood stock updated",
      blood,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBloodStock = async (req, res) => {
  try {
    const blood = await BloodStock.findByIdAndDelete(req.params.id);

    if (!blood) {
      return res.status(404).json({
        success: false,
        message: "Blood stock not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blood stock deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestBlood = async (req, res) => {
  try {
    const request = await BloodRequest.create({
      patientId: req.body.patientId,
      bloodGroup: req.body.bloodGroup,
      unitsNeeded: req.body.unitsNeeded,
    });

    res.status(201).json({
      success: true,
      message: "Blood request sent",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      status: "pending",
    })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      patientId: req.params.patientId,
      isDeletedByUser: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMyBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { isDeletedByUser: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Request removed from history",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBloodRequestStatus = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate(
      "patientId",
      "name email"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const { status, approvedUnits } = req.body;

    request.status = status;

    if (status === "approved") {
      const units = Number(approvedUnits);

      if (!units || units <= 0) {
        return res.status(400).json({
          success: false,
          message: "Approved units required",
        });
      }

      const stock = await BloodStock.findOne({
        bloodGroup: request.bloodGroup,
        status: "available",
      });

      if (!stock || stock.units < units) {
        return res.status(400).json({
          success: false,
          message: "Insufficient blood units",
        });
      }

      request.approvedUnits = units;
      stock.units -= units;

      if (stock.units <= 0) {
        stock.status = "expired";
      }

      await stock.save();

      if (request.patientId?.email) {
        await sendMail(
          request.patientId.email,
          "Blood Request Approved",
          `Your blood request for ${request.bloodGroup} has been approved. Approved units: ${units}. Please collect it from the hospital blood bank.`
        );
      }
    }

    if (status === "rejected") {
      request.approvedUnits = 0;

      if (request.patientId?.email) {
        await sendMail(
          request.patientId.email,
          "Blood Request Rejected",
          `Your blood request for ${request.bloodGroup} has been rejected. Please contact the hospital for more details.`
        );
      }
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request updated",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};