import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/labbooking.css";

const LabTestBooking = () => {
  const BASE_URL = "http://localhost:5000";

 const user =
  JSON.parse(localStorage.getItem("user")) || {};

const userId =
  user._id || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [tests, setTests] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    tests: [],
    bookingDate: "",
    bookingTime: "",
  });

  const headers = {
    role: "patient",
    Authorization: `Bearer ${token}`,
  };

  const fetchTests = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/lab/tests`
      );

      setTests(data.tests || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/lab/bookings/${user._id}`,
        { headers }
      );

      setBookings(data.bookings || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTests();

    if (user._id) {
      fetchBookings();
    }
  }, []);

  const selectTest = (id) => {
    if (form.tests.includes(id)) {
      setForm({
        ...form,
        tests: form.tests.filter((testId) => testId !== id),
      });
    } else {
      setForm({
        ...form,
        tests: [...form.tests, id],
      });
    }
  };

  const bookTest = async (e) => {
    e.preventDefault();

    if (!user._id) {
      return alert("Please login first");
    }

    if (form.tests.length === 0) {
      return alert("Please select at least one test");
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/lab/book-test`,
        {
          patientId: user._id,
          tests: form.tests,
          bookingDate: form.bookingDate,
          bookingTime: form.bookingTime,
        },
        { headers }
      );

      alert(data.message || "Test booked successfully");

      setForm({
        tests: [],
        bookingDate: "",
        bookingTime: "",
      });

      fetchBookings();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Booking failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="lab-page">
        <div className="lab-header">
          <div>
            <h1>Lab Test Booking</h1>
            <p>
              Book lab tests and track your booking status.
            </p>
          </div>

          <div className="lab-icon">🧪</div>
        </div>

        <div className="lab-layout">
          <div className="lab-box">
            <h2>Available Tests</h2>

            <form onSubmit={bookTest}>
              <div className="test-list">
                {tests.length === 0 ? (
                  <p>No tests available</p>
                ) : (
                  tests.map((test) => (
                    <label
                      className="test-option"
                      key={test._id}
                    >
                      <input
                        type="checkbox"
                        checked={form.tests.includes(test._id)}
                        onChange={() => selectTest(test._id)}
                      />

                      <span>
                        {test.testName} - ₹{test.price}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <input
                type="date"
                value={form.bookingDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingDate: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                value={form.bookingTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingTime: e.target.value,
                  })
                }
                required
              />

              <button type="submit">
                Book Test
              </button>
            </form>
          </div>

          <div className="lab-box">
            <h2>Selected Tests</h2>

            {form.tests.length === 0 ? (
              <p>No test selected</p>
            ) : (
              tests
                .filter((test) =>
                  form.tests.includes(test._id)
                )
                .map((test) => (
                  <p key={test._id}>
                    ✅ {test.testName} - ₹{test.price}
                  </p>
                ))
            )}
          </div>
        </div>

        <div className="lab-section">
          <h2>My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="empty-box">
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking._id}
              >
                <div>
                  <h3>
                    {booking.tests
                      ?.map((test) => test.testName)
                      .join(", ")}
                  </h3>

                  <p>
                    <strong>Date:</strong>{" "}
                    {booking.bookingDate}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {booking.bookingTime}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`lab-status ${booking.status}`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  <p>
                    <strong>Report:</strong>{" "}
                    {booking.reportUploaded
                      ? "Uploaded"
                      : "Not Uploaded"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LabTestBooking;