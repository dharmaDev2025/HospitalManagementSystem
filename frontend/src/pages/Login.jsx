import { useState, useContext } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  AppContext,
} from "../context/AppContext";

import "./../css/login.css";

function Login() {

  const navigate = useNavigate();

  const { setUser } =
    useContext(AppContext);



  const [formData, setFormData] =
    useState({

      email: "",

      password: "",

      role: "",

    });



  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };



  // ================= HANDLE LOGIN =================

  const handleLogin = async (e) => {

    e.preventDefault();



    try {

      const res =
        await axios.post(

          "https://hospitalmanagementsystem-nz84.onrender.com/api/auth/login",

          formData
        );



      // ================= SAVE USER =================

      setUser(res.data.user);



      localStorage.setItem(

        "user",

        JSON.stringify(
          res.data.user
        )
      );



      localStorage.setItem(

        "token",

        res.data.token
      );



      // ================= REDIRECT =================

      const role =
        res.data.user.role;



      if (role === "admin") {

        navigate(
          "/admin/dashboard"
        );

      }

      else if (
        role === "doctor"
      ) {

        navigate(
          "/doctor/dashboard"
        );

      }

      else if (
        role === "labExpert"
      ) {

        navigate(
          "/lab/dashboard"
        );

      }

      else {

        navigate(
          "/patient/dashboard"
        );

      }



      alert(
        res.data.message
      );

    } catch (error) {

      alert(

        error.response?.data?.message ||

        "Login Failed"

      );

    }
  };



  return (

    <>

      <Navbar />



      <div className="login-container">

        <div className="login-box">

          <h1>

            Login

          </h1>



          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <input

              type="email"

              name="email"

              placeholder="Enter Email"

              value={formData.email}

              onChange={handleChange}

              required

            />



            {/* PASSWORD */}

            <input

              type="password"

              name="password"

              placeholder="Enter Password"

              value={formData.password}

              onChange={handleChange}

              required

            />



            {/* ROLE */}

            <select

              name="role"

              value={formData.role}

              onChange={handleChange}

              required

            >

              <option value="">
                Select Role
              </option>

              <option value="patient">
                Patient
              </option>

              <option value="doctor">
                Doctor
              </option>

              <option value="labExpert">
                Lab Expert
              </option>

              <option value="admin">
                Admin
              </option>

            </select>



            {/* LOGIN BUTTON */}

            <button type="submit">

              Login

            </button>

          </form>



          {/* REGISTER LINK */}

          <p className="register-text">

            New User ?

            <Link to="/register">

              Register

            </Link>

          </p>

        </div>

      </div>

    </>
  );
}

export default Login;
