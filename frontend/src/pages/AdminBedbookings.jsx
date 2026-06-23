import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";

import "../css/adminBedBookings.css";

function AdminBedBookings() {
  const [bookings, setBookings] =
    useState([]);

  const BASE_URL =
    "https://hospitalmanagementsystem-nz84.onrender.com";

  const getHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      headers: {
        role: "admin",
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ================= FETCH BOOKINGS =================

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/beds/bookings`,
        getHeaders()
      );

      setBookings(
        res.data.bookings || []
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch bookings"
      );
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= ASSIGN BED =================

  const assignBed = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/beds/assign/${id}`,
        {},
        getHeaders()
      );

      alert(
        "Bed Assigned Successfully"
      );

      fetchBookings();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Assign Failed"
      );
    }
  };

  // ================= DISCHARGE =================

  const dischargePatient = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/beds/discharge/${id}`,
        {},
        getHeaders()
      );

      alert("Patient Discharged");

      fetchBookings();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Discharge Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-booking-page">
        <div className="booking-header">
          <h1>
            Bed Booking Requests
          </h1>
        </div>

        <div className="booking-table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Bed</th>
                <th>Room</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No bed bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking?.patientId?.name ||
                        "Patient"}
                    </td>

                    <td>
                      {booking?.bedId?.bedNumber ||
                        "N/A"}
                    </td>

                    <td>
                      {booking?.bedId?.roomNumber ||
                        "N/A"}
                    </td>

                    <td>
                      <span
                        className={`status ${booking.bookingStatus}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`payment ${booking.paymentStatus}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      {booking?.assignedDoctor?.name ||
                        "Not Assigned"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        {booking.bookingStatus ===
                          "pending" && (
                          <button
                            className="assign-btn"
                            onClick={() =>
                              assignBed(booking._id)
                            }
                          >
                            Assign
                          </button>
                        )}

                        {booking.bookingStatus ===
                          "assigned" && (
                          <button
                            className="discharge-btn"
                            onClick={() =>
                              dischargePatient(
                                booking._id
                              )
                            }
                          >
                            Discharge
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminBedBookings;
