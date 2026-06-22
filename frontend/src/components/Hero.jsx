import "./../css/hero.css";

import {
  useNavigate,
} from "react-router-dom";

function Hero() {

  const navigate =
    useNavigate();



  // ================= GET USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  // ================= BOOK BUTTON =================

  const handleBookNow = () => {

    // If not logged in

    if (!user) {

      navigate("/login");

      return;

    }



    // If logged in

    if (
      user.role === "patient"
    ) {

      navigate(
        "/patient/dashboard"
      );

    }

    else if (
      user.role === "doctor"
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

  };



  // ================= EXPLORE SERVICES =================

  const handleExplore = () => {

    const section =
      document.getElementById(
        "services"
      );



    if (section) {

      section.scrollIntoView({

        behavior: "smooth",

      });

    }

  };



  return (

    <section className="hero">



      {/* ================= LEFT ================= */}

      <div className="hero-left">



        <h1>

          Best Healthcare
          For Your Family

        </h1>



        <p>

          Book appointments,
          order medicines,
          laboratory tests,
          ambulance services
          and more.

        </p>



        {/* BUTTONS */}

        <div className="hero-buttons">



          {/* BOOK NOW */}

          <button
            onClick={
              handleBookNow
            }
          >

            Book Appointment

          </button>



          {/* EXPLORE */}

          <button
            className="explore-btn"
            onClick={
              handleExplore
            }
          >

            Explore Services

          </button>

        </div>

      </div>



      {/* ================= RIGHT ================= */}

      <div className="hero-right">

        <img

          src="https://images.unsplash.com/photo-1584515933487-779824d29309"

          alt="doctor"

        />

      </div>

    </section>
  );
}

export default Hero;