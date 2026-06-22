import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/profilepage.css";

const ProfilePage = () => {
  const BASE_URL = "http://localhost:5000";

  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const localUser =
      JSON.parse(localStorage.getItem("user")) || {};

    setUser(localUser);

    setForm({
      name: localUser.name || "",
      phone: localUser.phone || "",
    });
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/update-profile/${user._id}`,
        form,
        {
          headers: {
            role: user.role,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);
      setEditMode(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const firstLetter =
    user.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">
            {firstLetter}
          </div>

          {!editMode ? (
            <>
              <h2>{user.name || "User Name"}</h2>

              <span className="profile-role">
                {user.role || "user"}
              </span>

              <div className="profile-info">
                <p>
                  <strong>Email:</strong>{" "}
                  {user.email || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {user.phone || "N/A"}
                </p>

                <p>
                  <strong>User ID:</strong>{" "}
                  {user._id ||
                    localStorage.getItem("userId")}
                </p>
              </div>

              <button
                className="edit-profile-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form
              className="edit-profile-form"
              onSubmit={updateProfile}
            >
              <h2>Edit Profile</h2>

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />

              <div className="profile-actions">
                <button type="submit">
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;