import Navbar from "../components/Navbar";
import {
  FaUserMd,
  FaPills,
  FaBed,
  FaTint,
  FaAmbulance,
  FaShieldAlt,
  FaFlask,
  FaFileInvoiceDollar,
  FaChartLine,
  FaHome,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "./../css/adminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="admin-dashboard-container">

        {/* ================= HEADER ================= */}
        <div className="admin-welcome-banner">

          <div>
            <h1>Admin Panel 👨‍💼</h1>
            <p>Manage hospital system efficiently</p>
          </div>

          <div className="admin-profile-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="admin-stats-grid">

          <div className="admin-stat-card">
            <FaChartLine className="icon" />
            <h2>Dashboard</h2>
            <p>System Overview</p>
          </div>

          <div className="admin-stat-card">
            <FaHome className="icon" />
            <h2>Hospital</h2>
            <p>Live Management</p>
          </div>

        </div>

        {/* ================= MAIN MODULES ================= */}
        <div className="admin-grid">

          {/* Doctors */}
          <div className="admin-card">
            <FaUserMd className="icon" />
            <h2>Doctor Management</h2>
            <p>Add, update & remove doctors</p>
            <button onClick={() => navigate("/admin/doctors")}>
              Manage
            </button>
          </div>

          {/* Medicines */}
          <div className="admin-card">
            <FaPills className="icon" />
            <h2>Medicine Management</h2>
            <p>Control hospital pharmacy stock</p>
           <button onClick={() => navigate("/admin/pharmacy")}>
  Manage
</button>
          </div>

          {/* Beds */}
          <div className="admin-card">
            <FaBed className="icon" />
            <h2>Bed Management</h2>
            <p>ICU & general bed control</p>
            <button onClick={() => navigate("/admin/beds")}>
              Manage
            </button>
          </div>

          {/* Blood Bank */}
          <div className="admin-card">
            <FaTint className="icon" />
            <h2>Blood Bank</h2>
            <p>Stock & request management</p>
            <button onClick={() => navigate("/admin/blood")}>
              Manage
            </button>
          </div>

          {/* Ambulance */}
          <div className="admin-card">
            <FaAmbulance className="icon" />
            <h2>Ambulance Service</h2>
            <p>Handle emergency requests</p>
            <button onClick={() => navigate("/admin/ambulance")}>
              Manage
            </button>
          </div>

          {/* Insurance */}
          <div className="admin-card">
            <FaShieldAlt className="icon" />
            <h2>Insurance Claims</h2>
            <p>Approve / reject claims</p>
            <button onClick={() => navigate("/admin/insurance")}>
              Manage
            </button>
          </div>

          {/* Lab */}
          <div className="admin-card">
            <FaFlask className="icon" />
            <h2>Laboratory</h2>
            <p>Manage tests & reports</p>
            <button onClick={() => navigate("/admin/lab")}>
              Manage
            </button>
          </div>

         

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;