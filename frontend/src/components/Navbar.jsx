import "./../css/navbar.css";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaHeartbeat,
} from "react-icons/fa";

import {
  useContext,
  useState,
} from "react";

import {
  AppContext,
} from "../context/AppContext";

function Navbar() {

  const navigate =
    useNavigate();



  // ================= CONTEXT =================

  const {

    user,

    setUser,

  } = useContext(AppContext);



  // ================= STATE =================

  const [showMenu, setShowMenu] =
    useState(false);



  // ================= LOGIN CHECK =================

  const isLoggedIn = !!user;



  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );



    setUser(null);



    navigate("/login");

  };



  return (

    <nav className="navbar">



      {/* ================= LOGO ================= */}

      <div

        className="logo-section"

        onClick={() =>
          navigate("/")
        }

      >

        <div className="logo-icon">

          <FaHeartbeat />

        </div>



        <h1 className="logo-text">

          MediCare

        </h1>

      </div>



      {/* ================= RIGHT SECTION ================= */}

      <div className="right-section">



        {

          !isLoggedIn ? (

            <Link

              to="/login"

              className="login-btn"

            >

              Login

            </Link>

          ) : (

            <div className="profile-wrapper">



              {/* PROFILE ICON */}

              <div

                className="profile-circle-nav"

                onClick={() =>

                  setShowMenu(
                    !showMenu
                  )

                }

              >

                {

                  user?.name
                  ?.charAt(0)
                  .toUpperCase()

                }

              </div>



              {/* ================= DROPDOWN ================= */}

              {

                showMenu && (

                  <div className="profile-dropdown">



                    {/* USER NAME */}

                    <p>

                      {user?.name}

                    </p>



                    {/* DASHBOARD */}

                    <button

                      onClick={() => {

                        setShowMenu(false);



                        if (

                          user.role ===
                          "patient"

                        ) {

                          navigate(
                            "/patient/dashboard"
                          );

                        }

                        else if (

                          user.role ===
                          "doctor"

                        ) {

                          navigate(
                            "/doctor/dashboard"
                          );

                        }

                        else if (

                          user.role ===
                          "labExpert"

                        ) {

                          navigate(
                            "/lab/dashboard"
                          );

                        }

                        else {

                          navigate(
                            "/admin/dashboard"
                          );

                        }

                      }}

                    >

                      Dashboard

                    </button>



                    {/* LOGOUT */}

                    <button

                      onClick={
                        handleLogout
                      }

                    >

                      Logout

                    </button>

                  </div>

                )

              }

            </div>

          )

        }



        {/* ================= MOBILE ICON ================= */}

        <div className="menu-icon">

          <FaBars />

        </div>

      </div>

    </nav>
  );
}

export default Navbar;