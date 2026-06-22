import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/appointment.css";

const BookAppointment = () => {
  const BASE_URL = "http://localhost:5000";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const patientId =
    user._id || localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");

  const [activeType, setActiveType] = useState({});
  const [activeDay, setActiveDay] = useState({});
  const [doctorSlots, setDoctorSlots] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});

  const headers = {
    role: "patient",
    Authorization: `Bearer ${token}`,
  };

  const getNextThreeDates = () => {
    const labels = ["Today", "Tomorrow", "After One Day"];

    return labels.map((label, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      return {
        label,
        value: date.toISOString().split("T")[0],
      };
    });
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/doctors`
      );

      setDoctors(data.doctors || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSlots = async (doctorId, type, date) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/slots/${doctorId}`,
        {
          params: {
            treatmentType: type,
            appointmentDate: date,
          },
        }
      );

      setDoctorSlots((prev) => ({
        ...prev,
        [`${doctorId}-${type}-${date}`]: data.slots || [],
      }));
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Slot loading failed"
      );
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openDaySlots = (doctorId, type, date) => {
    setActiveType((prev) => ({
      ...prev,
      [doctorId]: type,
    }));

    setActiveDay((prev) => ({
      ...prev,
      [doctorId]: date,
    }));

    fetchSlots(doctorId, type, date);
  };

  const selectSlot = (
    doctorId,
    type,
    date,
    time,
    booked
  ) => {
    if (booked) return;

    setSelectedSlots((prev) => ({
      ...prev,
      [doctorId]: {
        treatmentType: type,
        appointmentDate: date,
        appointmentTime: time,
      },
    }));
  };

  const bookAppointment = async (doctor) => {
  const selected = selectedSlots[doctor._id];

  if (!patientId) {
    return alert("Please login first");
  }

  if (!selected) {
    return alert("Please select a slot");
  }

  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/appointments/create-checkout`,
      {
        patientId,
        doctorId: doctor._id,
        treatmentType: selected.treatmentType,
        appointmentDate: selected.appointmentDate,
        appointmentTime: selected.appointmentTime,
      },
      { headers }
    );

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Payment URL not received");
    }
  } catch (error) {
    console.log(error);
    alert(
      error.response?.data?.message ||
        "Payment start failed"
    );
  }
};

  const specializations = [
    "all",
    ...new Set(
      doctors.map((doc) => doc.specialization)
    ),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const name =
      doctor.userId?.name?.toLowerCase() || "";

    const spec =
      doctor.specialization?.toLowerCase() || "";

    const searchMatch =
      name.includes(search.toLowerCase()) ||
      spec.includes(search.toLowerCase());

    const filterMatch =
      specialization === "all" ||
      doctor.specialization === specialization;

    return searchMatch && filterMatch;
  });

  return (
    <>
      <Navbar />

      <div className="book-page">
        <div className="book-header">
          <h1>Book Doctor Appointment</h1>
          <p>
            Search doctor, choose online/offline slot,
            pay fees and book appointment.
          </p>
        </div>

        <div className="search-filter-box">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={specialization}
            onChange={(e) =>
              setSpecialization(e.target.value)
            }
          >
            {specializations.map((item) => (
              <option value={item} key={item}>
                {item === "all"
                  ? "All Specializations"
                  : item}
              </option>
            ))}
          </select>
        </div>

        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => {
            const activeDate =
              activeDay[doctor._id];

            const type =
              activeType[doctor._id];

            const selected =
              selectedSlots[doctor._id];

            const slotKey =
              `${doctor._id}-${type}-${activeDate}`;

            const slots =
              doctorSlots[slotKey] || [];

            return (
              <div
                className="doctor-card"
                key={doctor._id}
              >
                <div className="doctor-top">
                  <img
                    src={
                      doctor.image ||
                      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                    }
                    alt="doctor"
                  />

                  <div>
                    <h3>{doctor.userId?.name}</h3>

                    <p className="specialization">
                      {doctor.specialization}
                    </p>

                    <p>
                      {doctor.experience} years experience
                    </p>

                    <p>₹{doctor.fees} consultation fee</p>
                  </div>
                </div>

                <div className="treatment-buttons">
                  <button
                    type="button"
                    className={
                      type === "online"
                        ? "type-btn active-online"
                        : "type-btn"
                    }
                    onClick={() =>
                      setActiveType((prev) => ({
                        ...prev,
                        [doctor._id]: "online",
                      }))
                    }
                  >
                    Online
                  </button>

                  <button
                    type="button"
                    className={
                      type === "offline"
                        ? "type-btn active-offline"
                        : "type-btn"
                    }
                    onClick={() =>
                      setActiveType((prev) => ({
                        ...prev,
                        [doctor._id]: "offline",
                      }))
                    }
                  >
                    Offline
                  </button>
                </div>

                {type && (
                  <div className="day-buttons">
                    {getNextThreeDates().map((day) => (
                      <button
                        type="button"
                        key={day.value}
                        className={
                          activeDate === day.value
                            ? "day-btn active-day"
                            : "day-btn"
                        }
                        onClick={() =>
                          openDaySlots(
                            doctor._id,
                            type,
                            day.value
                          )
                        }
                      >
                        {day.label}
                        <span>{day.value}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeDate && (
                  <div className="slot-box">
                    <h4>
                      {type === "online"
                        ? "Online Slots"
                        : "Offline Slots"}
                    </h4>

                    {slots.length === 0 ? (
                      <p>No slots loaded</p>
                    ) : (
                      <div className="slot-list">
                        {slots.map((slot) => (
                          <button
                            type="button"
                            key={slot.time}
                            disabled={slot.booked}
                            className={
                              slot.booked
                                ? "slot-btn booked"
                                : selected?.appointmentTime ===
                                    slot.time &&
                                  selected?.appointmentDate ===
                                    activeDate &&
                                  selected?.treatmentType === type
                                ? "slot-btn selected"
                                : "slot-btn"
                            }
                            onClick={() =>
                              selectSlot(
                                doctor._id,
                                type,
                                activeDate,
                                slot.time,
                                slot.booked
                              )
                            }
                          >
                            {slot.time}
                            <small>
                              {slot.booked
                                ? "Booked"
                                : "Available"}
                            </small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="book-btn"
                  onClick={() => bookAppointment(doctor)}
                >
                  Pay Fees & Book
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BookAppointment;