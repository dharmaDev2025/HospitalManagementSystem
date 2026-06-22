import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/userdashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Doctor Appointment",
      desc: "Book online or offline doctor consultation",
      icon: "👨‍⚕️",
      path: "/doctors",
    },
    {
      title: "My Appointments",
      desc: "View your booked doctor appointments",
      icon: "📅",
      path: "/my-appointments",
    },
    {
      title: "Prescriptions",
      desc: "View prescriptions given by doctors",
      icon: "💊",
      path: "/my-prescriptions",
    },
    {
      title: "Medicines",
      desc: "Buy medicines and healthcare products",
      icon: "🛒",
      path: "/medicines",
    },
    {
      title: "My Orders",
      desc: "Track your medicine orders",
      icon: "📦",
      path: "/my-orders",
    },
    {
      title: "Lab Tests",
      desc: "Book lab tests and diagnostics",
      icon: "🧪",
      path: "/lab-tests",
    },
    {
      title: "Lab Reports",
      desc: "View and download your lab reports",
      icon: "📄",
      path: "/my-lab-reports",
    },
    {
      title: "Ambulance",
      desc: "Request emergency ambulance service",
      icon: "🚑",
      path: "/ambulance",
    },
    {
      title: "Bed Booking",
      desc: "Request hospital bed availability",
      icon: "🛏️",
      path: "/bed-booking",
    },
    {
      title: "Blood Request",
      desc: "Request blood based on blood group",
      icon: "🩸",
      path: "/blood-request",
    },
    {
      title: "Insurance",
      desc: "Upload insurance and apply for claims",
      icon: "🛡️",
      path: "/insurance",
    },
    {
      title: "Profile",
      desc: "Manage your personal information",
      icon: "👤",
      path: "/profile",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="user-dashboard">
        <div className="dashboard-hero">
          <div>
            <h1>User Dashboard</h1>
            <p>
              Manage your appointments, reports, medicine orders,
              emergency services and health records in one place.
            </p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-card">
            <h2>24/7</h2>
            <p>Healthcare Access</p>
          </div>

          <div className="summary-card">
            <h2>12</h2>
            <p>Services Available</p>
          </div>

          <div className="summary-card">
            <h2>Fast</h2>
            <p>Booking Support</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {cards.map((card, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-icon">{card.icon}</div>

              <h3>{card.title}</h3>

              <p>{card.desc}</p>

              <button onClick={() => navigate(card.path)}>
                Open
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;