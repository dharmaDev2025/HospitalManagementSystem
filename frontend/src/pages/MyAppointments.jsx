import { useEffect, useState } from "react";
import axios from "axios";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/myappointment.css";

const MyAppointments = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const patientId =
    user._id || localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);

  const headers = {
    role: "patient",
    Authorization: `Bearer ${token}`,
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/patient/${patientId}`,
        { headers }
      );

      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const confirmPaymentAndFetch = async () => {
      const sessionId = params.get("session_id");

      try {
        if (sessionId) {
          await axios.post(
            `${BASE_URL}/api/appointments/confirm-payment`,
            { sessionId },
            { headers }
          );

          navigate("/my-appointments", {
            replace: true,
          });
        }

        fetchAppointments();
      } catch (error) {
        console.log(error);
        fetchAppointments();
      }
    };

    if (patientId) {
      confirmPaymentAndFetch();
    }
  }, [patientId]);

  const canChatNow = (app) => {
    if (app.status === "completed") return false;

    if (!app.chatEnabled) return false;

    if (!app.appointmentDate || !app.appointmentTime) {
      return false;
    }

    const appointmentDateTime = new Date(
      `${app.appointmentDate}T${app.appointmentTime}:00`
    );

    const now = new Date();

    const diffMinutes =
      (now - appointmentDateTime) / 1000 / 60;

    return diffMinutes >= -15 && diffMinutes <= 120;
  
  };

  return (
    <>
      <Navbar />

      <div className="my-appointments-page">
        <h1>My Appointments</h1>

        {appointments.length === 0 ? (
          <div className="empty-box">
            No appointments found
          </div>
        ) : (
          <div className="appointment-grid">
            {appointments.map((app) => (
              <div
                className="appointment-card"
                key={app._id}
              >
                <h3>
                  Dr. {app.doctorId?.userId?.name}
                </h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {app.treatmentType}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {app.appointmentDate}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {app.appointmentTime}
                </p>

                <p>
                  <strong>Fees:</strong> ₹{app.fees}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {app.paymentStatus}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${app.status}`}>
                    {app.status}
                  </span>
                </p>

                {app.status === "completed" ? (
                  <button
                    className="completed-btn"
                    disabled
                  >
                    Consultation Completed
                  </button>
                ) : (
                  app.treatmentType === "online" &&
                  app.chatEnabled && (
                    canChatNow(app) ? (
                      <button
                        className="chat-btn"
                        onClick={() =>
                          navigate(`/chat/${app._id}`)
                        }
                      >
                        Chat With Doctor
                      </button>
                    ) : (
                      <button
                        className="disabled-chat-btn"
                        disabled
                      >
                        Consultation Not Started
                      </button>
                    )
                  )
                )}

                {app.treatmentType === "offline" &&
                  app.status === "accepted" && (
                    <button className="receipt-btn">
                      Download Receipt
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyAppointments;
