import Insurance from "../models/Insurance.js";

import InsuranceClaim from "../models/InsuranceClaim.js";

import Tesseract from "tesseract.js";

import path from "path";
import pdf from "pdf-poppler";


// =====================================
// AI OCR VERIFICATION
// =====================================

const verifyInsuranceWithOCR =
  async (
    providerName,
    policyNumber,
    expiryDate,
    certificateFile
  ) => {

    let extractedText = "";

  try {

  const fullCertificatePath =
    path.join(
      process.cwd(),
      "uploads",
      certificateFile.filename
    );

  const ext =
    path.extname(fullCertificatePath)
      .toLowerCase();

  if (ext === ".pdf") {

    const options = {
      format: "png",
      out_dir: path.join(process.cwd(), "uploads"),
      out_prefix: certificateFile.filename,
      page: 1,
    };

    await pdf.convert(
      fullCertificatePath,
      options
    );

    const imagePath = path.join(
      process.cwd(),
      "uploads",
      `${certificateFile.filename}-1.png`
    );

    const result =
      await Tesseract.recognize(
        imagePath,
        "eng"
      );

    extractedText =
      result.data.text || "";

  } else {

    const result =
      await Tesseract.recognize(
        fullCertificatePath,
        "eng"
      );

    extractedText =
      result.data.text || "";
  }

} catch (error) {

  console.log(error);

  extractedText = "";
}

    let aiStatus = "verified";
    let aiScore = 95;
    let remarks =
      "Insurance certificate verified successfully";

    const lowerText =
      extractedText.toLowerCase();

    if (!extractedText) {

      aiStatus = "suspicious";
      aiScore = 40;
      remarks =
        "OCR could not read certificate clearly";

    } else if (
      !lowerText.includes(
        providerName.toLowerCase()
      )
    ) {

      aiStatus = "suspicious";
      aiScore = 60;
      remarks =
        "Provider name not found clearly in certificate";

    } else if (
      !lowerText.includes(
        policyNumber.toLowerCase()
      )
    ) {

      aiStatus = "suspicious";
      aiScore = 55;
      remarks =
        "Policy number not found clearly in certificate";

    }

    if (
      new Date(expiryDate) <
      new Date()
    ) {

      aiStatus = "rejected";
      aiScore = 20;
      remarks =
        "Insurance policy is expired";
    }

    if (
      providerName
        .toLowerCase()
        .includes("fake")
    ) {

      aiStatus = "rejected";
      aiScore = 15;
      remarks =
        "Provider name looks suspicious";
    }

    return {
      extractedText,
      aiStatus,
      aiScore,
      remarks,
    };
};


// =====================================
// ADD INSURANCE WITH CERTIFICATE + ID PROOF
// =====================================

export const addInsurance =
  async (req, res) => {

    try {

      const {

        patientId,
        providerName,
        policyNumber,
        coverageAmount,
        expiryDate,

      } = req.body;

      const certificateFile =
        req.files
          ?.insuranceCertificate?.[0];

      const idProofFile =
        req.files
          ?.idProof?.[0];

      if (
        !certificateFile ||
        !idProofFile
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Insurance certificate and ID proof are required",
        });
      }

      const insuranceCertificate =
        `/uploads/${certificateFile.filename}`;

      const idProof =
        `/uploads/${idProofFile.filename}`;

      const aiResult =
        await verifyInsuranceWithOCR(
          providerName,
          policyNumber,
          expiryDate,
          certificateFile
        );

      const insurance =
        await Insurance.create({

          patientId,

          providerName,

          policyNumber,

          coverageAmount,

          expiryDate,

          insuranceCertificate,

          idProof,

          ocrText:
            aiResult.extractedText,

          aiVerificationStatus:
            aiResult.aiStatus,

          aiConfidenceScore:
            aiResult.aiScore,

          remarks:
            aiResult.remarks,
        });

      res.status(201).json({

        success: true,

        message:
          "Insurance uploaded and verified successfully",

        insurance,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// GET MY INSURANCES
// =====================================

export const getMyInsurances =
  async (req, res) => {

    try {

      const insurances =
        await Insurance.find({

          patientId:
            req.params.patientId,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        insurances,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// APPLY CLAIM WITH DOCUMENTS
// =====================================

export const applyClaim =
  async (req, res) => {

    try {

      const {

        patientId,
        insuranceId,
        claimAmount,
        hospitalBill,

      } = req.body;

      const insurance =
        await Insurance.findById(
          insuranceId
        );

      if (!insurance) {

        return res.status(404).json({

          success: false,

          message:
            "Insurance not found",
        });
      }

      if (
        insurance.aiVerificationStatus !==
        "verified"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Only verified insurance can apply claim",
        });
      }

      const documents =
        req.files
          ? req.files.map(
              (file) =>
                `/uploads/${file.filename}`
            )
          : [];

      const claim =
        await InsuranceClaim.create({

          patientId,

          insuranceId,

          claimAmount,

          hospitalBill,

          documents,
        });

      res.status(201).json({

        success: true,

        message:
          "Claim applied successfully",

        claim,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// GET MY CLAIMS
// =====================================

export const getMyClaims =
  async (req, res) => {

    try {

      const claims =
        await InsuranceClaim.find({

          patientId:
            req.params.patientId,

          isDeletedByUser: false,

        })

          .populate("insuranceId")

          .populate(
            "patientId",
            "name email"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        claims,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// DELETE MY CLAIM FROM HISTORY
// =====================================

export const deleteMyClaim =
  async (req, res) => {

    try {

      const claim =
        await InsuranceClaim.findByIdAndUpdate(

          req.params.id,

          {
            isDeletedByUser: true,
          },

          {
            new: true,
          }
        );

      res.status(200).json({

        success: true,

        message:
          "Claim removed from history",

        claim,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// ADMIN GET ACTIVE CLAIMS
// =====================================

export const getAllClaims =
  async (req, res) => {

    try {

      const claims =
        await InsuranceClaim.find({

          status: {
            $in: [
              "pending",
              "under_review",
            ],
          },

        })

          .populate(
            "patientId",
            "name email"
          )

          .populate("insuranceId")

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        claims,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};


// =====================================
// UPDATE CLAIM STATUS
// =====================================

export const updateClaimStatus =
  async (req, res) => {

    try {

      const claim =
        await InsuranceClaim.findByIdAndUpdate(

          req.params.id,

          {

            status:
              req.body.status,

            adminRemarks:
              req.body.adminRemarks,
          },

          {
            new: true,
          }
        );

      res.status(200).json({

        success: true,

        message:
          "Claim updated",

        claim,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};