import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/labexpertmanagement.css";

const BASE_URL = "http://localhost:5000";

const LabExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [tests, setTests] = useState([]);

  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [editExpertId, setEditExpertId] = useState(null);
  const [editTestId, setEditTestId] = useState(null);

  const [expertForm, setExpertForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [testForm, setTestForm] = useState({
    testName: "",
    price: "",
    expertId: "",
  });

  const fetchExperts = async () => {
    const res = await axios.get(`${BASE_URL}/api/lab/experts`, {
      headers: { role: "admin" },
    });

    setExperts(res.data.experts || []);
  };

  const fetchTests = async () => {
    const res = await axios.get(`${BASE_URL}/api/lab/all-tests`, {
      headers: { role: "admin" },
    });

    setTests(res.data.tests || []);
  };

  useEffect(() => {
    fetchExperts();
    fetchTests();
  }, []);

  const resetExpertForm = () => {
    setExpertForm({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
    setEditExpertId(null);
  };

  const resetTestForm = () => {
    setTestForm({
      testName: "",
      price: "",
      expertId: "",
    });
    setEditTestId(null);
  };

  const saveExpert = async (e) => {
    e.preventDefault();

    if (editExpertId) {
      await axios.put(
        `${BASE_URL}/api/lab/update-expert/${editExpertId}`,
        expertForm,
        { headers: { role: "admin" } }
      );
    } else {
      await axios.post(
        `${BASE_URL}/api/lab/add-expert`,
        expertForm,
        { headers: { role: "admin" } }
      );
    }

    setShowExpertModal(false);
    resetExpertForm();
    fetchExperts();
  };

  const deleteExpert = async (id) => {
    if (!window.confirm("Delete this lab expert?")) return;

    await axios.delete(`${BASE_URL}/api/lab/delete-expert/${id}`, {
      headers: { role: "admin" },
    });

    fetchExperts();
    fetchTests();
  };

  const openEditExpert = (expert) => {
    setEditExpertId(expert._id);

    setExpertForm({
      name: expert.name || "",
      email: expert.email || "",
      password: "",
      phone: expert.phone || "",
    });

    setShowExpertModal(true);
  };

  const saveTest = async (e) => {
    e.preventDefault();

    if (editTestId) {
      await axios.put(
        `${BASE_URL}/api/lab/update-test/${editTestId}`,
        testForm,
        { headers: { role: "admin" } }
      );
    } else {
      await axios.post(
        `${BASE_URL}/api/lab/add-test`,
        testForm,
        { headers: { role: "admin" } }
      );
    }

    setShowTestModal(false);
    resetTestForm();
    fetchTests();
  };

  const deleteTest = async (id) => {
    if (!window.confirm("Delete this test?")) return;

    await axios.delete(`${BASE_URL}/api/lab/delete-test/${id}`, {
      headers: { role: "admin" },
    });

    fetchTests();
  };

  const openEditTest = (test) => {
    setEditTestId(test._id);

    setTestForm({
      testName: test.testName || "",
      price: test.price || "",
      expertId: test.expertId?._id || test.expertId || "",
    });

    setShowTestModal(true);
  };

  return (
    <>
      <Navbar />

      <div className="lab-page">
        <div className="lab-header">
          <h1>Lab Expert Management</h1>

          <div className="header-actions">
            <button
              onClick={() => {
                resetExpertForm();
                setShowExpertModal(true);
              }}
            >
              + Add Lab Expert
            </button>

            <button
              className="test-btn"
              onClick={() => {
                resetTestForm();
                setShowTestModal(true);
              }}
            >
              + Add Lab Test
            </button>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <h2>{experts.length}</h2>
            <p>Total Experts</p>
          </div>

          <div className="summary-card blue">
            <h2>{tests.length}</h2>
            <p>Total Tests</p>
          </div>
        </div>

        <div className="table-section">
          <h2>Lab Experts</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {experts.map((expert) => (
                <tr key={expert._id}>
                  <td>{expert.name}</td>
                  <td>{expert.email}</td>
                  <td>{expert.phone}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openEditExpert(expert)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteExpert(expert._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h2>Lab Tests</h2>

          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Price</th>
                <th>Assigned Expert</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td>{test.testName}</td>
                  <td>₹{test.price}</td>
                  <td>{test.expertId?.name || "Not Assigned"}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openEditTest(test)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTest(test._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showExpertModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>
                {editExpertId ? "Update Lab Expert" : "Add Lab Expert"}
              </h2>

              <form onSubmit={saveExpert}>
                <input
                  type="text"
                  placeholder="Expert Name"
                  value={expertForm.name}
                  onChange={(e) =>
                    setExpertForm({
                      ...expertForm,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={expertForm.email}
                  onChange={(e) =>
                    setExpertForm({
                      ...expertForm,
                      email: e.target.value,
                    })
                  }
                  required
                />

                {!editExpertId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={expertForm.password}
                    onChange={(e) =>
                      setExpertForm({
                        ...expertForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                )}

                <input
                  type="text"
                  placeholder="Phone"
                  value={expertForm.phone}
                  onChange={(e) =>
                    setExpertForm({
                      ...expertForm,
                      phone: e.target.value,
                    })
                  }
                />

                <div className="modal-actions">
                  <button type="submit">
                    {editExpertId ? "Update" : "Add"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowExpertModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTestModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>
                {editTestId ? "Update Lab Test" : "Add Lab Test"}
              </h2>

              <form onSubmit={saveTest}>
                <input
                  type="text"
                  placeholder="Test Name"
                  value={testForm.testName}
                  onChange={(e) =>
                    setTestForm({
                      ...testForm,
                      testName: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={testForm.price}
                  onChange={(e) =>
                    setTestForm({
                      ...testForm,
                      price: e.target.value,
                    })
                  }
                  required
                />

                <select
                  value={testForm.expertId}
                  onChange={(e) =>
                    setTestForm({
                      ...testForm,
                      expertId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Lab Expert</option>

                  {experts.map((expert) => (
                    <option key={expert._id} value={expert._id}>
                      {expert.name}
                    </option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button type="submit">
                    {editTestId ? "Update" : "Add"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowTestModal(false)}
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

export default LabExpertManagement;
