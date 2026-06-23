import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/mylabreport.css";

const MyLabReports = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const patientId =
    user._id || localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);

  const headers = {
    role: "patient",
    Authorization: `Bearer ${token}`,
  };

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/lab/reports/${patientId}`,
        { headers }
      );

      setReports(data.reports || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  return (
    <>
      <Navbar />

      <div className="report-page">
        <h1>My Lab Reports</h1>

        {reports.length === 0 ? (
          <div className="empty-report">
            No reports available
          </div>
        ) : (
          <div className="report-grid">
            {reports.map((report) => (
              <div
                className="report-card"
                key={report._id}
              >
                <h3>Lab Report</h3>

                <p>
                  <strong>Details:</strong>
                </p>

                <div className="report-details">
                  {report.reportDetails}
                </div>

                <p>
                  <strong>Uploaded By:</strong>{" "}
                  {report.uploadedBy?.name ||
                    "Lab Expert"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    report.createdAt
                  ).toLocaleDateString()}
                </p>

                {report.reportFile && (
                  <a
                   href={
  report.reportFile?.startsWith("/")
    ? `${BASE_URL}${report.reportFile}`
    : `${BASE_URL}/${report.reportFile}`
}
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyLabReports;
