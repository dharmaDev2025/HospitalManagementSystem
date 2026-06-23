import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/insuranceadmin.css";

const InsuranceAdmin = () => {

  const [claims, setClaims] =
    useState([]);

  const [filteredClaims, setFilteredClaims] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedClaim, setSelectedClaim] =
    useState(null);

  const [status, setStatus] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const BASE_URL =
    "https://hospitalmanagementsystem-nz84.onrender.com";

  // ==========================================
  // FETCH CLAIMS
  // ==========================================

  const fetchClaims =
    async () => {

      try {

        const { data } =
          await axios.get(

            `${BASE_URL}/api/insurance/all-claims`,

            {

              headers: {
                role: "admin",
              },

            }
          );

        setClaims(
          data.claims || []
        );

        setFilteredClaims(
          data.claims || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchClaims();

  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {

    let updated = claims.filter(
      (c) =>

        c?.patientId?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

    if (filterStatus !== "all") {

      updated =
        updated.filter(
          (c) =>
            c.status ===
            filterStatus
        );
    }

    setFilteredClaims(updated);

  }, [

    search,

    filterStatus,

    claims,

  ]);

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = (claim) => {

    setSelectedClaim(claim);

    setStatus(claim.status);

    setRemarks(
      claim.adminRemarks || ""
    );

    setShowModal(true);
  };

  // ==========================================
  // UPDATE CLAIM
  // ==========================================

  const updateClaim =
    async (e) => {

      e.preventDefault();

      try {

        await axios.put(

          `${BASE_URL}/api/insurance/status/${selectedClaim._id}`,

          {

            status,

            adminRemarks:
              remarks,
          },

          {

            headers: {
              role: "admin",
            },
          }
        );

        alert(
          "Claim Updated"
        );

        setShowModal(false);

        fetchClaims();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <>
      <Navbar />

      <div className="insurance-page">

        {/* TOP */}

        <div className="top-section">

          <h1>
            Insurance Claims
          </h1>

        </div>

        {/* DASHBOARD */}

        <div className="dashboard-cards">

          <div className="dash-card">

            <h2>
              {claims.length}
            </h2>

            <p>
              Total Claims
            </p>

          </div>

          <div className="dash-card approved">

            <h2>

              {

                claims.filter(
                  (c) =>
                    c.status ===
                    "approved"
                ).length
              }

            </h2>

            <p>
              Approved
            </p>

          </div>

          <div className="dash-card pending">

            <h2>

              {

                claims.filter(
                  (c) =>
                    c.status ===
                    "pending"
                ).length
              }

            </h2>

            <p>
              Pending
            </p>

          </div>

          <div className="dash-card rejected">

            <h2>

              {

                claims.filter(
                  (c) =>
                    c.status ===
                    "rejected"
                ).length
              }

            </h2>

            <p>
              Rejected
            </p>

          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="search-filter">

          <input

            type="text"

            placeholder="Search Patient"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select

            value={filterStatus}

            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>

          </select>

        </div>

        {/* CLAIM CARDS */}

        <div className="claims-container">

          {

            filteredClaims.map(
              (claim) => (

                <div
                  className="claim-card"
                  key={claim._id}
                >

                  <h3>

                    {

                      claim.patientId
                        ?.name
                    }

                  </h3>

                  <p>

                    <strong>
                      Provider:
                    </strong>

                    {

                      claim
                        ?.insuranceId
                        ?.providerName
                    }

                  </p>

                  <p>

                    <strong>
                      Policy:
                    </strong>

                    {

                      claim
                        ?.insuranceId
                        ?.policyNumber
                    }

                  </p>

                  <p>

                    <strong>
                      Claim:
                    </strong>

                    ₹
                    {
                      claim.claimAmount
                    }

                  </p>

                  <p>

                    <strong>
                      Hospital Bill:
                    </strong>

                    ₹
                    {
                      claim.hospitalBill
                    }

                  </p>

                  <p>

                    <strong>
                      AI Status:
                    </strong>

                    <span
                      className={`ai-status ${claim?.insuranceId?.aiVerificationStatus}`}
                    >

                      {

                        claim
                          ?.insuranceId
                          ?.aiVerificationStatus
                      }

                    </span>

                  </p>

                  <p>

                    <strong>
                      AI Score:
                    </strong>

                    {

                      claim
                        ?.insuranceId
                        ?.aiConfidenceScore
                    }%

                  </p>

                  <p>

                    <strong>
                      Status:
                    </strong>

                    <span
                      className={`status ${claim.status}`}
                    >

                      {
                        claim.status
                      }

                    </span>

                  </p>

                  <div className="action-buttons">

                    <button

                      className="edit-btn"

                      onClick={() =>
                        openModal(
                          claim
                        )
                      }
                    >

                      Review

                    </button>

                  </div>

                </div>
              )
            )
          }

        </div>

        {/* MODAL */}

        {

          showModal && (

            <div className="modal-overlay">

              <div className="modal">

                <h2>
                  Review Claim
                </h2>

                <form
                  onSubmit={
                    updateClaim
                  }
                >

                  <select

                    value={status}

                    onChange={(e) =>
                      setStatus(
                        e.target.value
                      )
                    }
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approve
                    </option>

                    <option value="rejected">
                      Reject
                    </option>

                  </select>

                  <textarea

                    placeholder="Admin Remarks"

                    value={remarks}

                    onChange={(e) =>
                      setRemarks(
                        e.target.value
                      )
                    }
                  />

                  <div className="modal-buttons">

                    <button type="submit">

                      Update

                    </button>

                    <button

                      type="button"

                      className="close-btn"

                      onClick={() =>
                        setShowModal(false)
                      }
                    >

                      Cancel

                    </button>

                  </div>

                </form>

              </div>

            </div>
          )
        }

      </div>
    </>
  );
};

export default InsuranceAdmin;
