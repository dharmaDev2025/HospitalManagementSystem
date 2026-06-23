import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/labexpertdashboard.css";

const LabExpertDashboard = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const expertId =
    user._id || localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDetails, setReportDetails] = useState("");
  const [reportFile, setReportFile] = useState(null);

  const headers = {
    role: "labExpert",
    Authorization: `Bearer ${token}`,
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/lab/expert-bookings/${expertId}`,
        { headers }
      );

      setBookings(data.bookings || []);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    }
  };

  useEffect(() => {
    if (expertId) {
      fetchBookings();
    }
  }, [expertId]);

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/lab/booking-status/${bookingId}`,
        { status },
        { headers }
      );

      alert(data.message || "Status updated");
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  const openReportModal = (booking) => {
    setSelectedBooking(booking);
    setReportDetails("");
    setReportFile(null);
    setShowReportModal(true);
  };

  const generateReport = async (e) => {
    e.preventDefault();

    if (!reportDetails) {
      return alert("Enter report details");
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/lab/generate-report`,
        {
          bookingId: selectedBooking._id,
          patientId: selectedBooking.patientId?._id,
          uploadedBy: expertId,
          reportDetails,
        },
        { headers }
      );

      alert(data.message || "Report generated");
      setShowReportModal(false);
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Report generation failed"
      );
    }
  };

  const uploadReport = async (e) => {
    e.preventDefault();

    if (!reportFile) {
      return alert("Please select PDF report");
    }

    if (!reportDetails) {
      return alert("Enter report details");
    }

    try {
      const formData = new FormData();

      formData.append("bookingId", selectedBooking._id);
      formData.append("patientId", selectedBooking.patientId?._id);
      formData.append("uploadedBy", expertId);
      formData.append("reportDetails", reportDetails);
      formData.append("reportFile", reportFile);

      const { data } = await axios.post(
        `${BASE_URL}/api/lab/upload-report`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(data.message || "Report uploaded");
      setShowReportModal(false);
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Report upload failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="lab-dashboard">
        <div className="lab-dashboard-header">
          <div>
            <h1>Lab Expert Dashboard</h1>
            <p>
              View assigned patient test requests, start tests,
              and generate or upload reports.
            </p>
          </div>

          <div className="lab-dashboard-icon">🔬</div>
        </div>

        <div className="lab-cards">
          <div className="lab-card">
            <h2>{bookings.length}</h2>
            <p>Total Bookings</p>
          </div>

          <div className="lab-card pending-card">
            <h2>
              {
                bookings.filter(
                  (b) => b.status === "pending"
                ).length
              }
            </h2>
            <p>Pending</p>
          </div>

          <div className="lab-card process-card">
            <h2>
              {
                bookings.filter(
                  (b) => b.status === "processing"
                ).length
              }
            </h2>
            <p>Processing</p>
          </div>

          <div className="lab-card complete-card">
            <h2>
              {
                bookings.filter(
                  (b) => b.status === "completed"
                ).length
              }
            </h2>
            <p>Completed</p>
          </div>
        </div>

        <div className="booking-grid">
          {bookings.length === 0 ? (
            <div className="empty-box">
              No assigned bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <div className="booking-header">
                  <h3>{booking.patientId?.name || "Patient"}</h3>

                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.patientId?.email || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {booking.patientId?.phone || "N/A"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.bookingDate}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {booking.bookingTime}
                </p>

                <p>
                  <strong>Assigned Tests:</strong>{" "}
                  {booking.tests
                    ?.map((test) => test.testName)
                    .join(", ")}
                </p>

                <p>
                  <strong>Report:</strong>{" "}
                  {booking.reportUploaded
                    ? "Uploaded"
                    : "Not Uploaded"}
                </p>

                <div className="btn-group">
                  {booking.status === "pending" && (
                    <button
                      className="process-btn"
                      onClick={() =>
                        updateStatus(
                          booking._id,
                          "processing"
                        )
                      }
                    >
                      Start Test
                    </button>
                  )}

                  {booking.status === "processing" && (
                    <button
                      className="generate-btn"
                      onClick={() =>
                        openReportModal(booking)
                      }
                    >
                      Generate / Upload Report
                    </button>
                  )}

                  {booking.status === "completed" && (
                    <button className="completed-btn" disabled>
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showReportModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Generate / Upload Lab Report</h2>

              <p>
                <strong>Patient:</strong>{" "}
                {selectedBooking.patientId?.name}
              </p>

              <p>
                <strong>Tests:</strong>{" "}
                {selectedBooking.tests
                  ?.map((test) => test.testName)
                  .join(", ")}
              </p>

              <textarea
                placeholder="Enter report details"
                value={reportDetails}
                onChange={(e) =>
                  setReportDetails(e.target.value)
                }
              />

              <div className="modal-actions">
                <button
                  className="generate-btn"
                  onClick={generateReport}
                >
                  Generate PDF
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowReportModal(false)
                  }
                >
                  Cancel
                </button>
              </div>

              <hr />

              <form onSubmit={uploadReport}>
                <label>Upload PDF Report</label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setReportFile(e.target.files[0])
                  }
                />

                <button
                  type="submit"
                  className="upload-btn"
                >
                  Upload PDF
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LabExpertDashboard;
