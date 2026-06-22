import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/ambulancemanagement.css";

const AmbulanceManagement = () => {
  const BASE_URL = "http://localhost:5000";

  const roleHeader = {
    headers: {
      role: "admin",
    },
  };

  const [ambulances, setAmbulances] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    ambulanceNumber: "",
    driverName: "",
    driverPhone: "",
    status: "available",
  });

  const fetchAmbulances = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/ambulance`,
        roleHeader
      );

      setAmbulances(data.ambulances || []);
      setFilteredData(data.ambulances || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/ambulance/bookings`,
        roleHeader
      );

      setBookings(data.bookings || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAmbulances();
    fetchBookings();
  }, []);

  useEffect(() => {
    let updated = ambulances.filter((a) =>
      a.ambulanceNumber
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (filterStatus !== "all") {
      updated = updated.filter(
        (a) => a.status === filterStatus
      );
    }

    setFilteredData(updated);
  }, [search, filterStatus, ambulances]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/ambulance/add`,
        formData,
        roleHeader
      );

      alert("Ambulance Added");

      setFormData({
        ambulanceNumber: "",
        driverName: "",
        driverPhone: "",
        status: "available",
      });

      fetchAmbulances();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (a) => {
    setEditingId(a._id);

    setFormData({
      ambulanceNumber: a.ambulanceNumber,
      driverName: a.driverName,
      driverPhone: a.driverPhone,
      status: a.status,
    });

    setShowModal(true);
  };

  const updateAmbulance = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/api/ambulance/update/${editingId}`,
        formData,
        roleHeader
      );

      alert("Updated Successfully");

      setShowModal(false);
      fetchAmbulances();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAmbulance = async (id) => {
    const confirmDelete = window.confirm("Delete Ambulance?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/ambulance/delete/${id}`,
        roleHeader
      );

      fetchAmbulances();
    } catch (error) {
      console.log(error);
    }
  };

  const assignAmbulance = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/ambulance/status/${id}`,
        {
          status: "assigned",
        },
        roleHeader
      );

      alert("Ambulance Assigned");

      fetchBookings();
      fetchAmbulances();
    } catch (error) {
      console.log(error);
      alert("Assign failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="ambulance-page">
        <div className="top-section">
          <h1>Ambulance Management</h1>
        </div>

        <form
          className="ambulance-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Ambulance Number"
            value={formData.ambulanceNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                ambulanceNumber: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={(e) =>
              setFormData({
                ...formData,
                driverName: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Driver Phone"
            value={formData.driverPhone}
            onChange={(e) =>
              setFormData({
                ...formData,
                driverPhone: e.target.value,
              })
            }
            required
          />

          <button type="submit">
            Add Ambulance
          </button>
        </form>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search Ambulance"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        <div className="card-container">
          {filteredData.map((a) => (
            <div className="card" key={a._id}>
              <h3>{a.ambulanceNumber}</h3>

              <p>
                <strong>Driver:</strong> {a.driverName}
              </p>

              <p>
                <strong>Phone:</strong> {a.driverPhone}
              </p>

              <span className={`status ${a.status}`}>
                {a.status}
              </span>

              <div className="action-buttons">
                <button
                  className="small-edit-btn"
                  onClick={() => openEditModal(a)}
                >
                  Edit
                </button>

                <button
                  className="small-delete-btn"
                  onClick={() => deleteAmbulance(a._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="booking-section">
          <h2>Ambulance Requests</h2>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              No ambulance requests found
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking._id}
              >
                <div>
                  <h3>
                    {booking.patientId?.name || "Patient"}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {booking.patientId?.email || "N/A"}
                  </p>

                  <p>
                    <strong>Pickup:</strong>{" "}
                    {booking.pickupLocation}
                  </p>

                  <p>
                    <strong>Destination:</strong>{" "}
                    {booking.destination}
                  </p>

                  <p>
                    <strong>Ambulance:</strong>{" "}
                    {booking.ambulanceId?.ambulanceNumber}
                  </p>

                  <p>
                    <strong>Driver:</strong>{" "}
                    {booking.ambulanceId?.driverName}
                  </p>
                </div>

                <div className="booking-right">
                  <span
                    className={`booking-status ${booking.status}`}
                  >
                    {booking.status}
                  </span>

                  <div className="booking-buttons">
                    <button
                      onClick={() =>
                        assignAmbulance(booking._id)
                      }
                      disabled={booking.status === "assigned"}
                    >
                      {booking.status === "assigned"
                        ? "Assigned"
                        : "Assign"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Update Ambulance</h2>

              <form onSubmit={updateAmbulance}>
                <input
                  type="text"
                  value={formData.ambulanceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ambulanceNumber: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driverName: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={formData.driverPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driverPhone: e.target.value,
                    })
                  }
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="busy">
                    Busy
                  </option>
                </select>

                <div className="modal-buttons">
                  <button type="submit">
                    Update
                  </button>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AmbulanceManagement;