import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/blood.css";

const Blood = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [bloodStock, setBloodStock] = useState([]);
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    unitsNeeded: "",
  });

  const fetchBloodStock = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/blood`);
      setBloodStock(data.bloodStock || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/blood/my-requests/${user._id}`,
        {
          headers: {
            role: "patient",
          },
        }
      );

      setRequests(data.requests || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBloodStock();

    if (user._id) {
      fetchMyRequests();
    }
  }, []);

  const requestBlood = async (e) => {
    e.preventDefault();

    if (!user._id) {
      return alert("Please login first");
    }

    try {
      await axios.post(
        `${BASE_URL}/api/blood/request`,
        {
          patientId: user._id,
          bloodGroup: formData.bloodGroup,
          unitsNeeded: Number(formData.unitsNeeded),
        },
        {
          headers: {
            role: "patient",
          },
        }
      );

      alert("Blood request sent");

      setFormData({
        bloodGroup: "",
        unitsNeeded: "",
      });

      fetchMyRequests();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Request failed");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/blood/delete-request/${id}`,
        {},
        {
          headers: {
            role: "patient",
          },
        }
      );

      alert("Request removed");
      fetchMyRequests();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="blood-page">
        <div className="blood-header">
          <div>
            <h1>Blood Bank</h1>
            <p>Check available blood and send request to hospital.</p>
          </div>

          <div className="blood-icon">🩸</div>
        </div>

        <div className="blood-layout">
          <div className="blood-stock-box">
            <h2>Available Blood Stock</h2>

            <div className="blood-stock-grid">
              {bloodStock.length === 0 ? (
                <div className="empty-blood">No blood available</div>
              ) : (
                bloodStock.map((blood) => (
                  <div className="blood-card" key={blood._id}>
                    <h3>{blood.bloodGroup}</h3>
                    <p>{blood.units} Units</p>
                    <span>Available</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="blood-request-box">
            <h2>Request Blood</h2>

            <form onSubmit={requestBlood}>
              <select
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bloodGroup: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <input
                type="number"
                placeholder="Units Needed"
                value={formData.unitsNeeded}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitsNeeded: e.target.value,
                  })
                }
                required
              />

              <button type="submit">Send Request</button>
            </form>
          </div>
        </div>

        <div className="my-blood-section">
          <h2>My Blood Requests</h2>

          {requests.length === 0 ? (
            <div className="empty-blood">No requests found</div>
          ) : (
            requests.map((req) => (
              <div className="blood-request-card" key={req._id}>
                <div>
                  <h3>{req.bloodGroup}</h3>

                  <p>
                    <strong>Needed:</strong> {req.unitsNeeded} Units
                  </p>

                  <p>
                    <strong>Approved:</strong> {req.approvedUnits} Units
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="blood-request-right">
                  <span className={`blood-status ${req.status}`}>
                    {req.status}
                  </span>

                  {(req.status === "approved" ||
                    req.status === "rejected") && (
                    <button
                      className="delete-history-btn"
                      onClick={() => deleteRequest(req._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Blood;
