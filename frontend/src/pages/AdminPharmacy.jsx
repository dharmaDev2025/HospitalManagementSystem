import Navbar from "../components/Navbar";

import { useNavigate } from "react-router-dom";

import {
  FaPills,
  FaClipboardList,
} from "react-icons/fa";

import "./../css/adminPharmacy.css";

function AdminPharmacy() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="admin-pharmacy-container">

        <h1>
          Pharmacy Management
        </h1>

        <div className="pharmacy-grid">

          {/* MEDICINES */}

          <div className="pharmacy-card">

            <FaPills className="icon" />

            <h2>
              Medicine Management
            </h2>

            <p>
              Add, update & delete medicines
            </p>

            <button
              onClick={() =>
                navigate(
                  "/admin/medicines"
                )
              }
            >
              Open
            </button>

          </div>

          {/* ORDERS */}

          <div className="pharmacy-card">

            <FaClipboardList className="icon" />

            <h2>
              Medicine Orders
            </h2>

            <p>
              Track patient medicine orders
            </p>

            <button
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              Open
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminPharmacy;