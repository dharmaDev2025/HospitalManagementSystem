import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/ambulance.css";

const Ambulance = () => {
  const BASE_URL = "http://localhost:5000";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [ambulances, setAmbulances] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    ambulanceId: "",
    pickupLocation: "",
    destination: "",
  });

  const fetchAmbulances = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/ambulance`
      );

      setAmbulances(data.ambulances || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/ambulance/my-bookings/${user._id}`,
        {
          headers: {
            role: "patient",
          },
        }
      );

      setBookings(data.bookings || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAmbulances();

    if (user._id) {
      fetchMyBookings();
    }
  }, []);

  const openBookForm = (ambulanceId) => {
    setFormData({
      ambulanceId,
      pickupLocation: "",
      destination: "",
    });

    setShowForm(true);
  };

  const requestAmbulance = async (e) => {
    e.preventDefault();

    if (!user._id) {
      return alert("Please login first");
    }

    try {
      await axios.post(
        `${BASE_URL}/api/ambulance/request`,
        {
          patientId: user._id,
          ambulanceId: formData.ambulanceId,
          pickupLocation: formData.pickupLocation,
          destination: formData.destination,
        },
        {
          headers: {
            role: "patient",
          },
        }
      );

      alert("Ambulance request sent successfully");

      setShowForm(false);

      setFormData({
        ambulanceId: "",
        pickupLocation: "",
        destination: "",
      });

      fetchMyBookings();
      fetchAmbulances();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Ambulance request failed"
      );
    }
  };

  const serviceCompleted = async (bookingId) => {
    try {
      await axios.put(
        `${BASE_URL}/api/ambulance/status/${bookingId}`,
        {
          status: "completed",
        },
        {
          headers: {
            role: "patient",
          },
        }
      );

      alert("Service completed");

      fetchMyBookings();
      fetchAmbulances();
    } catch (error) {
      console.log(error);
      alert("Failed to complete service");
    }
  };

  const copyNumber = (phone) => {
    navigator.clipboard.writeText(phone);
    alert("Phone number copied");
  };

  return (
    <>
      <Navbar />

      <div className="ambulance-page">
        <div className="ambulance-header">
          <div>
            <h1>Request Ambulance</h1>
            <p>
              Book an available ambulance and track your request.
            </p>
          </div>

          <div className="ambulance-icon">🚑</div>
        </div>

        <div className="ambulance-list">
          <h2>Available Ambulances</h2>

          {ambulances.length === 0 ? (
            <div className="empty-ambulance">
              No ambulance available
            </div>
          ) : (
            ambulances.map((amb) => (
              <div
                className={
                  amb.status === "available"
                    ? "ambulance-card"
                    : "ambulance-card busy"
                }
                key={amb._id}
              >
                <div>
                  <h3>{amb.ambulanceNumber}</h3>
                  <p>Driver: {amb.driverName}</p>
                  <p className="hidden-phone">
                    Phone shown after assigned
                  </p>
                </div>

                <div className="ambulance-card-right">
                  <span>{amb.status}</span>

                  {amb.status === "available" && (
                    <button
                      className="book-btn"
                      onClick={() => openBookForm(amb._id)}
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="booking-modal">
              <div className="booking-modal-header">
                <h2>Book Ambulance</h2>

                <button onClick={() => setShowForm(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={requestAmbulance}>
                <textarea
                  placeholder="Enter pickup location"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destination: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="my-ambulance-section">
          <h2>My Ambulance Requests</h2>

          {bookings.length === 0 ? (
            <div className="empty-ambulance">
              No ambulance request found
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                className="my-booking-card"
                key={booking._id}
              >
                <div>
                  <h3>
                    Ambulance:{" "}
                    {booking.ambulanceId?.ambulanceNumber}
                  </h3>

                  <p>
                    <strong>Pickup:</strong>{" "}
                    {booking.pickupLocation}
                  </p>

                  <p>
                    <strong>Destination:</strong>{" "}
                    {booking.destination}
                  </p>

                  <p>
                    <strong>Driver:</strong>{" "}
                    {booking.ambulanceId?.driverName}
                  </p>

                  {(booking.status === "assigned" ||
                    booking.status === "completed") && (
                    <div className="driver-contact">
                      <p>
                        <strong>Phone:</strong>{" "}
                        {booking.ambulanceId?.driverPhone}
                      </p>

                      <a
                        href={`tel:${booking.ambulanceId?.driverPhone}`}
                        className="call-btn"
                      >
                        Call Driver
                      </a>

                      <button
                        className="copy-btn"
                        onClick={() =>
                          copyNumber(
                            booking.ambulanceId?.driverPhone
                          )
                        }
                      >
                        Copy Number
                      </button>
                    </div>
                  )}

                  {booking.status === "assigned" && (
                    <button
                      className="pickup-btn"
                      onClick={() =>
                        serviceCompleted(booking._id)
                      }
                    >
                      Service Completed
                    </button>
                  )}
                </div>

                <span
                  className={`booking-status ${booking.status}`}
                >
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Ambulance;