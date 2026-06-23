import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/insurance.css";

const Insurance = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [insurances, setInsurances] = useState([]);
  const [claims, setClaims] = useState([]);

  const [insuranceForm, setInsuranceForm] = useState({
    providerName: "",
    policyNumber: "",
    coverageAmount: "",
    expiryDate: "",
    insuranceCertificate: null,
    idProof: null,
  });

  const [claimForm, setClaimForm] = useState({
    insuranceId: "",
    claimAmount: "",
    hospitalBill: "",
    documents: [],
  });

  const fetchMyInsurances = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/insurance/my-insurances/${user._id}`,
        {
          headers: {
            role: "patient",
          },
        }
      );

      setInsurances(data.insurances || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyClaims = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/insurance/my-claims/${user._id}`,
        {
          headers: {
            role: "patient",
          },
        }
      );

      setClaims(data.claims || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchMyInsurances();
      fetchMyClaims();
    }
  }, []);

  const handleInsuranceChange = (e) => {
    const { name, value, files } = e.target;

    setInsuranceForm({
      ...insuranceForm,
      [name]: files ? files[0] : value,
    });
  };

  const uploadInsurance = async (e) => {
    e.preventDefault();

    if (!user._id) {
      return alert("Please login first");
    }

    try {
      const formData = new FormData();

      formData.append("patientId", user._id);
      formData.append("providerName", insuranceForm.providerName);
      formData.append("policyNumber", insuranceForm.policyNumber);
      formData.append("coverageAmount", insuranceForm.coverageAmount);
      formData.append("expiryDate", insuranceForm.expiryDate);
      formData.append(
        "insuranceCertificate",
        insuranceForm.insuranceCertificate
      );
      formData.append("idProof", insuranceForm.idProof);

      const { data } = await axios.post(
        `${BASE_URL}/api/insurance/add`,
        formData,
        {
          headers: {
            role: "patient",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(data.message || "Insurance uploaded");

      setInsuranceForm({
        providerName: "",
        policyNumber: "",
        coverageAmount: "",
        expiryDate: "",
        insuranceCertificate: null,
        idProof: null,
      });

      fetchMyInsurances();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Insurance upload failed"
      );
    }
  };

  const handleClaimChange = (e) => {
    const { name, value, files } = e.target;

    setClaimForm({
      ...claimForm,
      [name]: files ? Array.from(files) : value,
    });
  };

  const applyClaim = async (e) => {
    e.preventDefault();

    if (!claimForm.insuranceId) {
      return alert("Please select insurance");
    }

    try {
      const formData = new FormData();

      formData.append("patientId", user._id);
      formData.append("insuranceId", claimForm.insuranceId);
      formData.append("claimAmount", claimForm.claimAmount);
      formData.append("hospitalBill", claimForm.hospitalBill);

      claimForm.documents.forEach((file) => {
        formData.append("documents", file);
      });

      const { data } = await axios.post(
        `${BASE_URL}/api/insurance/claim`,
        formData,
        {
          headers: {
            role: "patient",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(data.message || "Claim applied");

      setClaimForm({
        insuranceId: "",
        claimAmount: "",
        hospitalBill: "",
        documents: [],
      });

      fetchMyClaims();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Claim apply failed"
      );
    }
  };

  const deleteClaim = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/insurance/delete-claim/${id}`,
        {},
        {
          headers: {
            role: "patient",
          },
        }
      );

      alert("Claim removed from history");
      fetchMyClaims();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const fileUrl = (path) => {
    if (!path) return "#";
    return `${BASE_URL}${path}`;
  };

  const verifiedInsurances = insurances.filter(
    (item) => item.aiVerificationStatus === "verified"
  );

  return (
    <>
      <Navbar />

      <div className="insurance-page">
        <div className="insurance-header">
          <div>
            <h1>Insurance & Claims</h1>
            <p>
              Upload insurance documents, verify using OCR, and apply claims.
            </p>
          </div>

          <div className="insurance-icon">🛡️</div>
        </div>

        <div className="insurance-layout">
          <div className="insurance-upload-box">
            <h2>Upload Insurance</h2>

            <form onSubmit={uploadInsurance}>
              <input
                type="text"
                name="providerName"
                placeholder="Provider Name"
                value={insuranceForm.providerName}
                onChange={handleInsuranceChange}
                required
              />

              <input
                type="text"
                name="policyNumber"
                placeholder="Policy Number"
                value={insuranceForm.policyNumber}
                onChange={handleInsuranceChange}
                required
              />

              <input
                type="number"
                name="coverageAmount"
                placeholder="Coverage Amount"
                value={insuranceForm.coverageAmount}
                onChange={handleInsuranceChange}
                required
              />

              <input
                type="date"
                name="expiryDate"
                value={insuranceForm.expiryDate}
                onChange={handleInsuranceChange}
                required
              />

              <label>Insurance Certificate</label>
              <input
                type="file"
                name="insuranceCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleInsuranceChange}
                required
              />

              <label>ID Proof</label>
              <input
                type="file"
                name="idProof"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleInsuranceChange}
                required
              />

              <button type="submit">
                Upload & Verify
              </button>
            </form>
          </div>

          <div className="claim-box">
            <h2>Apply Claim</h2>

            <form onSubmit={applyClaim}>
              <select
                name="insuranceId"
                value={claimForm.insuranceId}
                onChange={handleClaimChange}
                required
              >
                <option value="">
                  Select Verified Insurance
                </option>

                {verifiedInsurances.map((ins) => (
                  <option
                    value={ins._id}
                    key={ins._id}
                  >
                    {ins.providerName} - {ins.policyNumber}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="claimAmount"
                placeholder="Claim Amount"
                value={claimForm.claimAmount}
                onChange={handleClaimChange}
                required
              />

              <input
                type="number"
                name="hospitalBill"
                placeholder="Hospital Bill Amount"
                value={claimForm.hospitalBill}
                onChange={handleClaimChange}
                required
              />

              <label>Claim Documents</label>
              <input
                type="file"
                name="documents"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleClaimChange}
                required
              />

              <button type="submit">
                Apply Claim
              </button>
            </form>
          </div>
        </div>

        <div className="my-insurance-section">
          <h2>My Insurance Policies</h2>

          {insurances.length === 0 ? (
            <div className="empty-insurance">
              No insurance uploaded
            </div>
          ) : (
            <div className="insurance-grid">
              {insurances.map((ins) => (
                <div
                  className="insurance-card"
                  key={ins._id}
                >
                  <div className="insurance-card-top">
                    <h3>{ins.providerName}</h3>

                    <span
                      className={`verify-status ${ins.aiVerificationStatus}`}
                    >
                      {ins.aiVerificationStatus}
                    </span>
                  </div>

                  <p>
                    <strong>Policy:</strong>{" "}
                    {ins.policyNumber}
                  </p>

                  <p>
                    <strong>Coverage:</strong> ₹
                    {ins.coverageAmount}
                  </p>

                  <p>
                    <strong>Expiry:</strong>{" "}
                    {ins.expiryDate}
                  </p>

                  <p>
                    <strong>AI Score:</strong>{" "}
                    {ins.aiConfidenceScore}%
                  </p>

                  <p>
                    <strong>Remarks:</strong>{" "}
                    {ins.remarks}
                  </p>

                  <div className="doc-links">
                    <a
                      href={fileUrl(ins.insuranceCertificate)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Certificate
                    </a>

                    <a
                      href={fileUrl(ins.idProof)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View ID Proof
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="my-claims-section">
          <h2>My Claims</h2>

          {claims.length === 0 ? (
            <div className="empty-insurance">
              No claims found
            </div>
          ) : (
            claims.map((claim) => (
              <div
                className="claim-card"
                key={claim._id}
              >
                <div>
                  <h3>
                    {claim.insuranceId?.providerName ||
                      "Insurance Claim"}
                  </h3>

                  <p>
                    <strong>Policy:</strong>{" "}
                    {claim.insuranceId?.policyNumber}
                  </p>

                  <p>
                    <strong>Claim Amount:</strong> ₹
                    {claim.claimAmount}
                  </p>

                  <p>
                    <strong>Hospital Bill:</strong> ₹
                    {claim.hospitalBill}
                  </p>

                  <p>
                    <strong>Admin Remarks:</strong>{" "}
                    {claim.adminRemarks || "No remarks"}
                  </p>

                  <div className="doc-links">
                    {claim.documents?.map((doc, index) => (
                      <a
                        href={fileUrl(doc)}
                        target="_blank"
                        rel="noreferrer"
                        key={index}
                      >
                        Document {index + 1}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="claim-right">
                  <span
                    className={`claim-status ${claim.status}`}
                  >
                    {claim.status}
                  </span>

                  {(claim.status === "approved" ||
                    claim.status === "rejected") && (
                    <button
                      onClick={() => deleteClaim(claim._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Insurance;
