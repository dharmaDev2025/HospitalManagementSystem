import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import "../css/myprescriptions.css";

const MyPrescriptions = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const patientId = user._id || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [prescriptions, setPrescriptions] = useState([]);

  const headers = {
    role: "patient",
    Authorization: `Bearer ${token}`,
  };

  const fetchPrescriptions = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/prescriptions/${patientId}`,
        { headers }
      );

      setPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load prescriptions");
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

 const downloadPrescription = (p) => {
  const doc = new jsPDF("p", "mm", "a4");

  const doctorName = p.doctorId?.userId?.name || "Doctor";
  const patientName = p.patientId?.name || "Patient";
  const date = new Date(p.createdAt).toLocaleDateString();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(22);
  doc.text(`Dr. ${doctorName}`, 18, 22);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("MEDICARE HOSPITAL | CONSULTANT DOCTOR", 18, 29);

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(34);
  doc.text("⚕", 170, 25);

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.line(0, 42, 210, 42);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);

  doc.text(`Patient Name: ${patientName}`, 18, 56);
  doc.text(`Date: ${date}`, 150, 56);

  doc.text(`Appointment ID: ${p.appointmentId?._id || p.appointmentId}`, 18, 66);
  doc.text(`Treatment: ${p.appointmentId?.treatmentType || "Consultation"}`, 18, 76);
  doc.text(`Visit Date: ${p.appointmentId?.appointmentDate || date}`, 110, 76);
  doc.text(`Visit Time: ${p.appointmentId?.appointmentTime || "N/A"}`, 160, 76);

  doc.setDrawColor(180, 180, 180);
  doc.line(18, 84, 192, 84);

  doc.setTextColor(10, 60, 100);
  doc.setFontSize(36);
  doc.text("Rx", 18, 105);

  doc.setTextColor(30, 41, 59);

  doc.setFontSize(14);
  doc.text("Medicines", 18, 125);

  doc.setFontSize(11);
  doc.text(p.medicines || "N/A", 18, 135, {
    maxWidth: 175,
    lineGap: 4,
  });

  doc.setFontSize(14);
  doc.text("Dosage", 18, 175);

  doc.setFontSize(11);
  doc.text(p.dosage || "N/A", 18, 185, {
    maxWidth: 175,
    lineGap: 4,
  });

  doc.setFontSize(14);
  doc.text("Advice", 18, 220);

  doc.setFontSize(11);
  doc.text(p.advice || "N/A", 18, 230, {
    maxWidth: 175,
    lineGap: 4,
  });

  doc.setDrawColor(120, 120, 120);
  doc.line(145, 260, 190, 260);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Dr. ${doctorName}`, 148, 267);
  doc.text("Signature", 158, 273);

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.line(0, 280, 210, 280);

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(10);
  doc.text("MEDICARE HOSPITAL", 18, 290);

  doc.setTextColor(60, 60, 60);
  doc.text("Bhubaneswar, Odisha", 80, 290);
  doc.text("+91 9876543210", 150, 290);

  doc.save(`prescription-${p._id}.pdf`);
};

  return (
    <>
      <Navbar />

      <div className="prescription-page">
        <h1>My Prescriptions</h1>

        {prescriptions.length === 0 ? (
          <div className="empty-box">
            No prescriptions found
          </div>
        ) : (
          <div className="prescription-grid">
            {prescriptions.map((p) => (
              <div className="prescription-card" key={p._id}>
                <h3>
                  Dr. {p.doctorId?.userId?.name || "Doctor"}
                </h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>

                <p>
                  <strong>Medicines:</strong>
                </p>
                <div className="prescription-box">
                  {p.medicines}
                </div>

                <p>
                  <strong>Dosage:</strong>
                </p>
                <div className="prescription-box">
                  {p.dosage || "N/A"}
                </div>

                <p>
                  <strong>Advice:</strong>
                </p>
                <div className="prescription-box">
                  {p.advice}
                </div>

                <button
                  className="download-btn"
                  onClick={() => downloadPrescription(p)}
                >
                  Download Prescription
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyPrescriptions;
