import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../css/doctorAdmin.css";

function AdminDoctorManagement() {

  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  // FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    fees: "",
    qualification: "",
    about: "",
    image: null,
  });

  // ================= FETCH DOCTORS =================
  const fetchDoctors = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/doctors"
      );

      setDoctors(res.data.doctors);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= FILTER LOGIC =================
  const filteredDoctors = doctors.filter((doc) => {

    const doctorName =
      doc.userId?.name?.toLowerCase() || "";

    const specialization =
      doc.specialization?.toLowerCase() || "";

    const matchesSearch =
      doctorName.includes(search.toLowerCase());

    const matchesSpecialization =
      specializationFilter
        ? specialization ===
          specializationFilter.toLowerCase()
        : true;

    return matchesSearch && matchesSpecialization;
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    if (e.target.name === "image") {

      setForm({
        ...form,
        image: e.target.files[0],
      });

    } else {

      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {

    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      experience: "",
      fees: "",
      qualification: "",
      about: "",
      image: null,
    });
  };

  // ================= ADD DOCTOR =================
  const addDoctor = async () => {

    try {

      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      await axios.post(
        "http://localhost:5000/api/doctors/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            role: "admin",
          },
        }
      );

      // FETCH UPDATED DATA
      await fetchDoctors();

      alert("Doctor Added Successfully");

      setOpenModal(false);
      resetForm();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Error adding doctor"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteDoctor = async (id) => {

    try {

      setLoading(true);

      await axios.delete(
        `http://localhost:5000/api/doctors/delete/${id}`,
        {
          headers: {
            role: "admin",
          },
        }
      );

      // FAST DELETE
      setDoctors((prev) =>
        prev.filter((doc) => doc._id !== id)
      );

      alert("Doctor Deleted");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // ================= OPEN EDIT =================
  const openEdit = (doc) => {

    setForm({
      name: doc.userId?.name || "",
      email: doc.userId?.email || "",
      password: "",
      phone: doc.userId?.phone || "",
      specialization: doc.specialization || "",
      experience: doc.experience || "",
      fees: doc.fees || "",
      qualification: doc.qualification || "",
      about: doc.about || "",
      image: null,
    });

    setEditId(doc._id);
    setEditMode(true);
    setOpenModal(true);
  };

  // ================= UPDATE =================
  const updateDoctor = async () => {

    try {

      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      await axios.put(
        `http://localhost:5000/api/doctors/update/${editId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            role: "admin",
          },
        }
      );

      // FETCH UPDATED DATA
      await fetchDoctors();

      alert("Doctor Updated Successfully");

      setOpenModal(false);
      setEditMode(false);
      resetForm();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Error updating doctor"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="doctor-admin-container">

        {/* ================= TOP BAR ================= */}
        <div className="top-bar">

          <h1>Doctor Management</h1>

          <button
            onClick={() => {
              resetForm();
              setEditMode(false);
              setOpenModal(true);
            }}
          >
            + Add Doctor
          </button>

        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="search-filter-box">

          <input
            type="text"
            placeholder="Search doctor by name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-input"
          />

          <select
            value={specializationFilter}
            onChange={(e) =>
              setSpecializationFilter(e.target.value)
            }
            className="filter-select"
          >
            <option value="">
              All Specializations
            </option>

            <option value="cardiologist">
              Cardiologist
            </option>

            <option value="neurologist">
              Neurologist
            </option>

            <option value="orthopedic">
              Orthopedic
            </option>

            <option value="dentist">
              Dentist
            </option>

            <option value="pediatrician">
              Pediatrician
            </option>

            <option value="dermatologist">
              Dermatologist
            </option>

          </select>

        </div>

        {/* ================= TABLE ================= */}
        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fees</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredDoctors.map((doc) => (

                <tr key={doc._id}>

                  <td>
                    <img
                      src={
                        doc.image ||
                        "https://via.placeholder.com/50"
                      }
                      alt="doctor"
                      className="doctor-img"
                    />
                  </td>

                  <td>{doc.userId?.name}</td>

                  <td>{doc.specialization}</td>

                  <td>{doc.experience} yrs</td>

                  <td>₹{doc.fees}</td>

                  <td className="action-buttons">

                    <button
                      className="btn-edit"
                      onClick={() => openEdit(doc)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() =>
                        deleteDoctor(doc._id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* ================= MODAL ================= */}
        {openModal && (

          <div className="modal">

            <div className="modal-box">

              <h2>
                {editMode
                  ? "Edit Doctor"
                  : "Add Doctor"}
              </h2>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Doctor Name"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />

              {!editMode && (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              )}

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
              />

              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Specialization"
              />

              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Experience"
              />

              <input
                type="number"
                name="fees"
                value={form.fees}
                onChange={handleChange}
                placeholder="Fees"
              />

              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="Qualification"
              />

              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="About Doctor"
              />

              {/* IMAGE */}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

              {/* BUTTONS */}
              <div className="modal-actions">

                <button
                  disabled={loading}
                  onClick={
                    editMode
                      ? updateDoctor
                      : addDoctor
                  }
                >
                  {loading
                    ? "Please wait..."
                    : editMode
                    ? "Update"
                    : "Save"}
                </button>

                <button
                  onClick={() => {
                    setOpenModal(false);
                    setEditMode(false);
                  }}
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default AdminDoctorManagement;