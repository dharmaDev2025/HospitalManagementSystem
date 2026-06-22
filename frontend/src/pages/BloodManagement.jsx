import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/bloodmanagement.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const BloodManagement = () => {
  const BASE_URL = "http://localhost:5000";

  const [stock, setStock] = useState([]);
  const [requests, setRequests] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    status: "approved",
    approvedUnits: 1,
  });

  const [stockForm, setStockForm] = useState({
    bloodGroup: "A+",
    units: 1,
    donorName: "",
    expiryDate: "",
  });

  const fetchStock = async () => {
    const res = await axios.get(`${BASE_URL}/api/blood`);
    setStock(res.data.bloodStock || []);
  };

  const fetchRequests = async () => {
    const res = await axios.get(`${BASE_URL}/api/blood/requests`, {
      headers: { role: "admin" },
    });

    setRequests(res.data.requests || []);
  };

  useEffect(() => {
    fetchStock();
    fetchRequests();
  }, []);

  const groupedStock = BLOOD_GROUPS.map((group) => ({
    group,
    units: stock
      .filter((s) => s.bloodGroup === group)
      .reduce((a, b) => a + Number(b.units), 0),
  }));

  const saveStock = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${BASE_URL}/api/blood/${editId}`, stockForm, {
        headers: { role: "admin" },
      });
    } else {
      await axios.post(`${BASE_URL}/api/blood/add`, stockForm, {
        headers: { role: "admin" },
      });
    }

    setShowAddModal(false);
    setEditId(null);

    setStockForm({
      bloodGroup: "A+",
      units: 1,
      donorName: "",
      expiryDate: "",
    });

    fetchStock();
  };

  const deleteStock = async (id) => {
    if (!window.confirm("Delete this blood stock?")) return;

    await axios.delete(`${BASE_URL}/api/blood/${id}`, {
      headers: { role: "admin" },
    });

    fetchStock();
  };

  const openEditStock = (s) => {
    setEditId(s._id);

    setStockForm({
      bloodGroup: s.bloodGroup,
      units: s.units,
      donorName: s.donorName,
      expiryDate: s.expiryDate?.slice(0, 10),
    });

    setShowHistory(false);
    setShowAddModal(true);
  };

  const openAddStock = () => {
    setEditId(null);

    setStockForm({
      bloodGroup: "A+",
      units: 1,
      donorName: "",
      expiryDate: "",
    });

    setShowAddModal(true);
  };

  const openModal = (req) => {
    setSelectedRequest(req);

    setFormData({
      status: "approved",
      approvedUnits: 1,
    });

    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(
      `${BASE_URL}/api/blood/status/${selectedRequest._id}`,
      formData,
      {
        headers: { role: "admin" },
      }
    );

    setShowModal(false);
    fetchRequests();
    fetchStock();
  };

  return (
    <>
      <Navbar />

      <div className="blood-page">
        <div className="top-header">
          <h1>Blood Management System</h1>
        </div>

        <div className="blood-grid">
          {groupedStock.map((g) => (
            <div
              key={g.group}
              className={`blood-card group-${g.group
                .replace("+", "plus")
                .replace("-", "minus")}`}
            >
              <h2>{g.group}</h2>
              <p>{g.units} Units Available</p>
            </div>
          ))}
        </div>

        <div className="action-bar">
          <button onClick={openAddStock}>+ Add Blood Stock</button>

          <button
            className="history-main-btn"
            onClick={() => setShowHistory(true)}
          >
            Donation History
          </button>
        </div>

        <div className="table-section">
          <h2>Blood Requests</h2>

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Group</th>
                <th>Units</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.patientId?.name}</td>
                  <td>{r.bloodGroup}</td>
                  <td>{r.unitsNeeded}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button className="manage-btn" onClick={() => openModal(r)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>{editId ? "Update Blood Stock" : "Add Blood Stock"}</h2>

              <form onSubmit={saveStock}>
                <select
                  value={stockForm.bloodGroup}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      bloodGroup: e.target.value,
                    })
                  }
                >
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Units"
                  value={stockForm.units}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      units: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Donor Name"
                  value={stockForm.donorName}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      donorName: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="date"
                  value={stockForm.expiryDate}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                />

                <div className="modal-actions">
                  <button type="submit">{editId ? "Update" : "Add"}</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Manage Request</h2>

              <form onSubmit={handleUpdate}>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>

                <input
                  type="number"
                  value={formData.approvedUnits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      approvedUnits: e.target.value,
                    })
                  }
                  required
                />

                <div className="modal-actions">
                  <button type="submit">Save</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="modal-overlay">
            <div className="modal-box history-modal">
              <h2>Donation History</h2>

              <div className="history-list">
                {stock.map((s) => (
                  <div key={s._id} className="history-item">
                    <div className="history-top">
                      <strong>{s.bloodGroup}</strong>

                      <div className="history-actions">
                        <button
                          className="edit-history-btn"
                          onClick={() => openEditStock(s)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-history-btn"
                          onClick={() => deleteStock(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div>Donor: {s.donorName}</div>
                    <div>Units: {s.units}</div>
                    <div>
                      Expiry:{" "}
                      {s.expiryDate
                        ? new Date(s.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="close-history"
                onClick={() => setShowHistory(false)}
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

export default BloodManagement;