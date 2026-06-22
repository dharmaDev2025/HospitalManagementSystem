import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "./../css/bedmanagement.css";

const BedManagement = () => {

  const navigate = useNavigate();

  const [beds, setBeds] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [selectedBed, setSelectedBed] = useState(null);

  // ================= ADD FORM =================

  const [addFormData, setAddFormData] = useState({

    bedNumber: "",

    roomNumber: "",

    floor: "",

    wardType: "general",

    bedType: "general",

  });

  // ================= EDIT FORM =================

  const [editFormData, setEditFormData] = useState({

    bedNumber: "",

    roomNumber: "",

    floor: "",

    wardType: "general",

    bedType: "general",

  });

  const BASE_URL = "http://localhost:5000";

  // ================= FETCH BEDS =================

  const fetchBeds = async () => {

    try {

      const { data } = await axios.get(

        `${BASE_URL}/api/beds`

      );

      setBeds(data.beds || []);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchBeds();

  }, []);

  // ================= ADD BED =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(

        `${BASE_URL}/api/beds/add`,

        addFormData,

        {

          headers: {

            role: "admin",

          },

        }

      );

      alert("Bed Added");

      setAddFormData({

        bedNumber: "",

        roomNumber: "",

        floor: "",

        wardType: "general",

        bedType: "general",

      });

      fetchBeds();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= OPEN MODAL =================

  const openModal = (bed) => {

    setSelectedBed(bed);

    setEditFormData({

      bedNumber: bed.bedNumber,

      roomNumber: bed.roomNumber,

      floor: bed.floor,

      wardType: bed.wardType,

      bedType: bed.bedType,

    });

    setShowModal(true);

  };

  // ================= UPDATE BED =================

  const updateBed = async (e) => {

    e.preventDefault();

    try {

      await axios.put(

        `${BASE_URL}/api/beds/${selectedBed._id}`,

        editFormData,

        {

          headers: {

            role: "admin",

          },

        }

      );

      alert("Bed Updated");

      setShowModal(false);

      fetchBeds();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= DELETE BED =================

  const deleteBed = async (id) => {

    const confirmDelete = window.confirm(

      "Delete this bed?"

    );

    if (!confirmDelete) return;

    try {

      await axios.delete(

        `${BASE_URL}/api/beds/${id}`,

        {

          headers: {

            role: "admin",

          },

        }

      );

      alert("Bed Deleted");

      fetchBeds();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FILTER =================

  const filteredBeds = beds.filter((bed) => {

    const matchesSearch =

      bed.bedNumber

        ?.toLowerCase()

        .includes(search.toLowerCase());

    const matchesFilter =

      filter === "all"

        ? true

        : bed.status === filter;

    return matchesSearch && matchesFilter;

  });

  return (

    <>

      <Navbar />

      <div className="bed-page">

        {/* HEADER */}

        <div className="top-header">

          <h1>
            Bed Management
          </h1>

          {/* VIEW REQUEST BUTTON */}

          <button

            className="view-bookings-btn"

            onClick={() =>

              navigate(

                "/admin/bed-bookings"

              )

            }

          >

            View Bed Requests

          </button>

        </div>

        {/* DASHBOARD */}

        <div className="dashboard-cards">

          <div className="dash-card">

            <h2>{beds.length}</h2>

            <p>Total Beds</p>

          </div>

          <div className="dash-card available-card">

            <h2>

              {

                beds.filter(

                  (b) => b.status === "vacant"

                ).length

              }

            </h2>

            <p>Vacant Beds</p>

          </div>

          <div className="dash-card occupied-card">

            <h2>

              {

                beds.filter(

                  (b) => b.status === "occupied"

                ).length

              }

            </h2>

            <p>Occupied Beds</p>

          </div>

        </div>

        {/* ADD BED */}

        <div className="form-section">

          <h2>Add Bed</h2>

          <form

            onSubmit={handleSubmit}

            className="bed-form"

          >

            <input

              placeholder="Bed Number"

              value={addFormData.bedNumber}

              onChange={(e) =>

                setAddFormData({

                  ...addFormData,

                  bedNumber: e.target.value,

                })

              }

            />

            <input

              placeholder="Room Number"

              value={addFormData.roomNumber}

              onChange={(e) =>

                setAddFormData({

                  ...addFormData,

                  roomNumber: e.target.value,

                })

              }

            />

            <input

              type="number"

              placeholder="Floor"

              value={addFormData.floor}

              onChange={(e) =>

                setAddFormData({

                  ...addFormData,

                  floor: e.target.value,

                })

              }

            />

            <select

              value={addFormData.wardType}

              onChange={(e) =>

                setAddFormData({

                  ...addFormData,

                  wardType: e.target.value,

                })

              }

            >

              <option value="general">

                General

              </option>

              <option value="ICU">

                ICU

              </option>

              <option value="emergency">

                Emergency

              </option>

            </select>

            <select

              value={addFormData.bedType}

              onChange={(e) =>

                setAddFormData({

                  ...addFormData,

                  bedType: e.target.value,

                })

              }

            >

              <option value="general">

                General

              </option>

              <option value="private">

                Private

              </option>

              <option value="ICU">

                ICU

              </option>

            </select>

            <button type="submit">

              Add Bed

            </button>

          </form>

        </div>

        {/* SEARCH */}

        <div className="search-filter">

          <input

            placeholder="Search Bed"

            value={search}

            onChange={(e) =>

              setSearch(e.target.value)

            }

          />

          <select

            value={filter}

            onChange={(e) =>

              setFilter(e.target.value)

            }

          >

            <option value="all">

              All

            </option>

            <option value="vacant">

              Vacant

            </option>

            <option value="occupied">

              Occupied

            </option>

          </select>

        </div>

        {/* BED CARDS */}

        <div className="beds-container">

          {filteredBeds.map((bed) => (

            <div

              className="bed-card"

              key={bed._id}

            >

              <h3>{bed.bedNumber}</h3>

              <p>

                Room: {bed.roomNumber}

              </p>

              <p>

                Floor: {bed.floor}

              </p>

              <p>

                Ward: {bed.wardType}

              </p>

              <p>

                Type: {bed.bedType}

              </p>

              <p>

                Status:

                <span

                  className={`status ${bed.status}`}

                >

                  {bed.status}

                </span>

              </p>

              <div className="card-buttons">

                <button

                  className="edit-btn"

                  onClick={() =>

                    openModal(bed)

                  }

                >

                  Edit

                </button>

                <button

                  className="delete-btn"

                  onClick={() =>

                    deleteBed(bed._id)

                  }

                >

                  Delete

                </button>

              </div>

            </div>

          ))}

        </div>

        {/* MODAL */}

        {showModal && (

          <div className="modal-overlay">

            <div className="modal-box">

              <h2>

                Update Bed

              </h2>

              <form

                onSubmit={updateBed}

                className="modal-form"

              >

                <input

                  placeholder="Bed Number"

                  value={editFormData.bedNumber}

                  onChange={(e) =>

                    setEditFormData({

                      ...editFormData,

                      bedNumber: e.target.value,

                    })

                  }

                />

                <input

                  placeholder="Room Number"

                  value={editFormData.roomNumber}

                  onChange={(e) =>

                    setEditFormData({

                      ...editFormData,

                      roomNumber: e.target.value,

                    })

                  }

                />

                <input

                  type="number"

                  placeholder="Floor"

                  value={editFormData.floor}

                  onChange={(e) =>

                    setEditFormData({

                      ...editFormData,

                      floor: e.target.value,

                    })

                  }

                />

                <select

                  value={editFormData.wardType}

                  onChange={(e) =>

                    setEditFormData({

                      ...editFormData,

                      wardType: e.target.value,

                    })

                  }

                >

                  <option value="general">

                    General

                  </option>

                  <option value="ICU">

                    ICU

                  </option>

                  <option value="emergency">

                    Emergency

                  </option>

                </select>

                <select

                  value={editFormData.bedType}

                  onChange={(e) =>

                    setEditFormData({

                      ...editFormData,

                      bedType: e.target.value,

                    })

                  }

                >

                  <option value="general">

                    General

                  </option>

                  <option value="private">

                    Private

                  </option>

                  <option value="ICU">

                    ICU

                  </option>

                </select>

                <div className="modal-buttons">

                  <button type="submit">

                    Update

                  </button>

                  <button

                    type="button"

                    className="close-btn"

                    onClick={() =>

                      setShowModal(false)

                    }

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

export default BedManagement;