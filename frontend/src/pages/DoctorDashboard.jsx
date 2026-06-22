import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import "../css/doctordashboard.css";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const DoctorDashboard = () => {
  const BASE_URL = "http://localhost:5000";
  const navigate = useNavigate();

  const localUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const doctorUserId =
    localUser._id || localStorage.getItem("userId");

  const [doctorId, setDoctorId] = useState(
    localStorage.getItem("doctorId")
  );

  const [appointments, setAppointments] = useState([]);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [prescription, setPrescription] = useState({
    medicines: "",
    dosage: "",
    advice: "",
  });

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

  const headers = {
    role: "doctor",
  };

  const findDoctorId = async () => {
    try {
      if (doctorId) return doctorId;

      const loginEmail =
        localUser.email || localStorage.getItem("email");

      const { data } = await axios.get(`${BASE_URL}/api/doctors`);

      const doctor = data.doctors?.find(
        (d) => d.userId?.email === loginEmail
      );

      if (doctor?._id) {
        localStorage.setItem("doctorId", doctor._id);
        setDoctorId(doctor._id);
        return doctor._id;
      }

      alert(`Doctor profile not found for email: ${loginEmail}`);
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const fetchAppointments = async () => {
    try {
      const id = await findDoctorId();
      if (!id) return;

      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/doctor/${id}`,
        { headers }
      );

      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/appointments/status/${id}`,
        { status },
        { headers }
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert("Status update failed");
    }
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);

    setPrescription({
      medicines: "",
      dosage: "",
      advice: "",
    });

    setShowPrescription(true);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/appointments/prescription`,
        {
          appointmentId: selectedAppointment._id,
          doctorId: selectedAppointment.doctorId?._id,
          patientId: selectedAppointment.patientId?._id,
          medicines: prescription.medicines,
          dosage: prescription.dosage,
          advice: prescription.advice,
        },
        { headers }
      );

      alert("Prescription added");
      setShowPrescription(false);
      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert("Prescription add failed");
    }
  };

  const openChatBox = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      setSelectedFile(null);
      setShowChat(true);

      socket.emit("joinAppointment", appointment._id);

      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/chat/${appointment._id}`,
        { headers }
      );

      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
      alert("Chat loading failed");
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!chatText.trim()) return;

    socket.emit("sendMessage", {
      appointmentId: selectedAppointment._id,
      senderId: doctorUserId,
      receiverId: selectedAppointment.patientId?._id,
      message: chatText,
    });

    setChatText("");
  };

  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        return alert("Please select a file");
      }

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("appointmentId", selectedAppointment._id);
      formData.append("senderId", doctorUserId);
      formData.append("receiverId", selectedAppointment.patientId?._id);

      await axios.post(
        `${BASE_URL}/api/appointments/chat/upload`,
        formData,
        {
          headers: {
            role: "doctor",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);

      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/chat/${selectedAppointment._id}`,
        { headers }
      );

      setMessages(data.messages || []);
      alert("File sent successfully");
    } catch (error) {
      console.log(error);
      alert("File upload failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="doctor-dashboard">
        <h1>Doctor Dashboard</h1>

        <div className="dashboard-cards">
          <div className="dash-card">
            <h2>{appointments.length}</h2>
            <p>Total</p>
          </div>

          <div className="dash-card pending-card">
            <h2>
              {appointments.filter((a) => a.status === "pending").length}
            </h2>
            <p>Pending</p>
          </div>

          <div className="dash-card online-card">
            <h2>
              {
                appointments.filter(
                  (a) => a.treatmentType === "online"
                ).length
              }
            </h2>
            <p>Online</p>
          </div>

          <div className="dash-card offline-card">
            <h2>
              {
                appointments.filter(
                  (a) => a.treatmentType === "offline"
                ).length
              }
            </h2>
            <p>Offline</p>
          </div>
        </div>

        <div className="appointment-grid">
          {appointments.length === 0 ? (
            <div className="empty-box">
              No appointments found
            </div>
          ) : (
            appointments.map((a) => (
              <div className="appointment-card" key={a._id}>
                <div className="card-header">
                  <h3>{a.patientId?.name || "Patient"}</h3>
                  <span className={`status ${a.status}`}>
                    {a.status}
                  </span>
                </div>

                <p><strong>Email:</strong> {a.patientId?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {a.patientId?.phone || "N/A"}</p>
                <p><strong>Type:</strong> {a.treatmentType}</p>
                <p><strong>Date:</strong> {a.appointmentDate}</p>
                <p><strong>Time:</strong> {a.appointmentTime}</p>
                <p><strong>Fees:</strong> ₹{a.fees}</p>
                <p><strong>Payment:</strong> {a.paymentStatus}</p>

                <div className="btn-group">
                  {a.treatmentType === "offline" &&
                    a.status === "pending" && (
                      <>
                        <button
                          className="accept-btn"
                          onClick={() => updateStatus(a._id, "accepted")}
                        >
                          Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => updateStatus(a._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                  {a.treatmentType === "online" && a.chatEnabled && (
                   <button
  className="chat-btn"
  onClick={() => navigate(`/chat/${a._id}`)}
>
  Open Consultation
</button>
                  )}

                  {a.status !== "completed" &&
                    a.status !== "rejected" && (
                      <button
                        className="prescription-btn"
                        onClick={() => openPrescriptionModal(a)}
                      >
                        Add Prescription
                      </button>
                    )}

                  {a.status === "accepted" && (
                    <button
                      className="complete-btn"
                      onClick={() => updateStatus(a._id, "completed")}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showPrescription && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Add Prescription</h2>

              <form onSubmit={submitPrescription}>
                <textarea
                  placeholder="Medicines"
                  value={prescription.medicines}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      medicines: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Dosage"
                  value={prescription.dosage}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      dosage: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Advice"
                  value={prescription.advice}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      advice: e.target.value,
                    })
                  }
                  required
                />

                <div className="modal-actions">
                  <button type="submit">Save</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowPrescription(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showChat && (
          <div className="modal-overlay">
            <div className="chat-box">
              <h2>Online Chat</h2>

              <div className="messages">
                {messages.map((msg, index) => {
                  const sender =
                    typeof msg.senderId === "object"
                      ? msg.senderId._id
                      : msg.senderId;

                  return (
                    <div
                      key={msg._id || index}
                      className={
                        sender === doctorUserId
                          ? "my-message"
                          : "other-message"
                      }
                    >
                      {msg.message && <p>{msg.message}</p>}

                      {msg.fileType === "image" && (
                        <img
                          src={`${BASE_URL}${msg.fileUrl}`}
                          alt="chat-file"
                          className="chat-image"
                        />
                      )}

                      {msg.fileType && msg.fileType !== "image" && (
                        <a
                          href={`${BASE_URL}${msg.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="file-link"
                        >
                          📎 {msg.fileName || "Download File"}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                />

                <button onClick={sendMessage}>Send</button>
              </div>

              <div className="file-upload-box">
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files[0])
                  }
                />

                <button onClick={uploadFile}>
                  Upload File
                </button>
              </div>

              {selectedFile && (
                <p className="selected-file">
                  Selected: {selectedFile.name}
                </p>
              )}

              <button
                className="close-chat"
                onClick={() => setShowChat(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorDashboard;