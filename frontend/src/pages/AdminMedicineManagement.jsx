import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";

import "./../css/adminMedicine.css";

function AdminMedicineManagement() {

  const [medicines, setMedicines] =
    useState([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  const [editId, setEditId] =
    useState("");



  // ================= SEARCH + FILTER =================

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");



  // ================= FORM =================

  const [form, setForm] =
    useState({

      name: "",

      description: "",

      price: "",

      stock: "",

      category: "",

      image: null,

    });



  // ================= FETCH MEDICINES =================

  const fetchMedicines =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/medicines"
          );

        setMedicines(
          res.data.medicines
        );

      } catch (error) {

        console.log(error);

      }

    };



  useEffect(() => {

    fetchMedicines();

  }, []);



  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    if (
      e.target.name === "image"
    ) {

      setForm({

        ...form,

        image:
          e.target.files[0],

      });

    }

    else {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    }

  };



  // ================= RESET FORM =================

  const resetForm = () => {

    setForm({

      name: "",

      description: "",

      price: "",

      stock: "",

      category: "",

      image: null,

    });

  };



  // ================= FILTERED MEDICINES =================

  const filteredMedicines =
    medicines.filter((med) => {

      const medicineName =
        med.name
          ?.toLowerCase()
          .trim() || "";



      const medicineCategory =
        med.category
          ?.toLowerCase()
          .trim() || "";



      const searchText =
        search
          .toLowerCase()
          .trim();



      const selectedCategory =
        categoryFilter
          .toLowerCase()
          .trim();



      const matchName =
        medicineName.includes(
          searchText
        );



      const matchCategory =

        selectedCategory === "" ||

        medicineCategory ===
          selectedCategory;



      return (
        matchName &&
        matchCategory
      );

    });



  // ================= ADD MEDICINE =================

  const addMedicine =
    async () => {

      try {

        const formData =
          new FormData();



        formData.append(
          "name",
          form.name
        );



        formData.append(
          "description",
          form.description
        );



        formData.append(
          "price",
          form.price
        );



        formData.append(
          "stock",
          form.stock
        );



        formData.append(
          "category",
          form.category
        );



        if (form.image) {

          formData.append(
            "image",
            form.image
          );

        }



        await axios.post(

          "http://localhost:5000/api/medicines/add",

          formData,

          {

            headers: {

              role: "admin",

            },

          }
        );



        alert(
          "Medicine Added Successfully"
        );



        setOpenModal(false);



        resetForm();



        fetchMedicines();

      } catch (error) {

        console.log(error);



        alert(

          error.response?.data
            ?.message ||

            "Add Failed"
        );

      }

    };



  // ================= DELETE =================

  const deleteMedicine =
    async (id) => {

      try {

        await axios.delete(

          `http://localhost:5000/api/medicines/${id}`,

          {

            headers: {

              role: "admin",

            },

          }
        );



        alert(
          "Medicine Deleted"
        );



        fetchMedicines();

      } catch (error) {

        console.log(error);



        alert(
          "Delete Failed"
        );

      }

    };



  // ================= OPEN EDIT =================

  const openEdit = (med) => {

    setEditMode(true);

    setEditId(med._id);

    setOpenModal(true);



    setForm({

      name: med.name,

      description:
        med.description,

      price: med.price,

      stock: med.stock,

      category: med.category,

      image: null,

    });

  };



  // ================= UPDATE =================

  const updateMedicine =
    async () => {

      try {

        const formData =
          new FormData();



        formData.append(
          "name",
          form.name
        );



        formData.append(
          "description",
          form.description
        );



        formData.append(
          "price",
          form.price
        );



        formData.append(
          "stock",
          form.stock
        );



        formData.append(
          "category",
          form.category
        );



        if (form.image) {

          formData.append(
            "image",
            form.image
          );

        }



        await axios.put(

          `http://localhost:5000/api/medicines/update/${editId}`,

          formData,

          {

            headers: {

              role: "admin",

            },

          }
        );



        alert(
          "Medicine Updated"
        );



        setOpenModal(false);

        setEditMode(false);



        resetForm();



        fetchMedicines();

      } catch (error) {

        console.log(error);



        alert(

          error.response?.data
            ?.message ||

            "Update Failed"
        );

      }

    };



  return (

    <>

      <Navbar />



      <div className="medicine-admin-container">



        {/* ================= TOP BAR ================= */}

        <div className="top-bar">



          <h1>

            Medicine Management

          </h1>



          <button

            onClick={() => {

              setOpenModal(true);

              setEditMode(false);

              resetForm();

            }}

          >

            + Add Medicine

          </button>

        </div>



        {/* ================= SEARCH FILTER ================= */}

        <div className="search-filter-container">



          <input

            type="text"

            placeholder="Search medicine by name..."

            value={search}

            onChange={(e) =>

              setSearch(
                e.target.value
              )

            }

          />



          <select

            value={categoryFilter}

            onChange={(e) =>

              setCategoryFilter(
                e.target.value
              )

            }

          >



            <option value="">

              All Categories

            </option>



            <option value="fever">

              Fever

            </option>



            <option value="antibiotic">

              Antibiotic

            </option>



            <option value="pain relief">

              Pain Relief

            </option>



            <option value="diabetes">

              Diabetes

            </option>



            <option value="vitamins">

              Vitamins

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

                <th>Price</th>

                <th>Stock</th>

                <th>Category</th>

                <th>Actions</th>

              </tr>

            </thead>



            <tbody>



              {filteredMedicines.map(
                (med) => (

                  <tr key={med._id}>



                    <td>

                      <img

                        src={med.image}

                        alt=""

                        className="medicine-img"

                      />

                    </td>



                    <td>

                      {med.name}

                    </td>



                    <td>

                      ₹ {med.price}

                    </td>



                    <td>

                      {med.stock}

                    </td>



                    <td>

                      {med.category}

                    </td>



                    <td className="action-buttons">



                      <button

                        className="edit-btn"

                        onClick={() =>
                          openEdit(
                            med
                          )
                        }

                      >

                        Edit

                      </button>



                      <button

                        className="delete-btn"

                        onClick={() =>
                          deleteMedicine(
                            med._id
                          )
                        }

                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>



      {/* ================= MODAL OUTSIDE ================= */}

      {openModal && (

        <div className="modal">



          <div className="modal-box">



            <h2>

              {editMode

                ? "Edit Medicine"

                : "Add Medicine"}

            </h2>



            <input

              type="text"

              name="name"

              placeholder="Medicine Name"

              value={form.name}

              onChange={
                handleChange
              }

            />



            <textarea

              name="description"

              placeholder="Description"

              value={
                form.description
              }

              onChange={
                handleChange
              }

            />



            <input

              type="number"

              name="price"

              placeholder="Price"

              value={form.price}

              onChange={
                handleChange
              }

            />



            <input

              type="number"

              name="stock"

              placeholder="Stock"

              value={form.stock}

              onChange={
                handleChange
              }

            />



            <input

              type="text"

              name="category"

              placeholder="Category"

              value={
                form.category
              }

              onChange={
                handleChange
              }

            />



            <input

              type="file"

              name="image"

              onChange={
                handleChange
              }

            />



            <div className="modal-buttons">



              <button

                onClick={

                  editMode

                    ? updateMedicine

                    : addMedicine

                }

              >

                {editMode

                  ? "Update"

                  : "Save"}

              </button>



              <button

                onClick={() => {

                  setOpenModal(false);

                  setEditMode(false);

                  resetForm();

                }}

              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}

export default AdminMedicineManagement;