import "./../css/featuredDoctors.css";

import {
  useNavigate,
} from "react-router-dom";

const doctors = [

  {

    id: 1,

    name: "Dr. Raj Sharma",

    specialization:
      "Cardiologist",

    experience:
      "10+ Years",

    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",

  },



  {

    id: 2,

    name: "Dr. Priya Singh",

    specialization:
      "Neurologist",

    experience:
      "8+ Years",

    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",

  },



  {

    id: 3,

    name: "Dr. Amit Kumar",

    specialization:
      "Orthopedic",

    experience:
      "12+ Years",

    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d",

  },



  {

    id: 4,

    name: "Dr. Neha Das",

    specialization:
      "Dermatologist",

    experience:
      "6+ Years",

    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f",

  },

];



function FeaturedDoctors() {

  const navigate =
    useNavigate();



  // ================= GET USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  // ================= BOOK LOGIC =================

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



  // ================= VIEW ALL =================

  const handleViewAll = () => {

    // If not login

    if (!user) {

      navigate("/login");

      return;

    }



    // If patient login

    if (
      user.role === "patient"
    ) {

      navigate("/doctors");

    }

    else {

      navigate("/");

    }

  };



  return (

    <section className="featured-doctors">



      {/* ================= TITLE ================= */}

      <div className="section-title">

        <h1>

          Meet Our Specialists

        </h1>



        <p>

          Trusted doctors with
          years of experience.

        </p>

      </div>



      {/* ================= DOCTOR CARDS ================= */}

      <div className="doctor-grid">



        {

          doctors.map((doctor) => (

            <div

              className="doctor-card"

              key={doctor.id}

            >



              {/* IMAGE */}

              <img

                src={doctor.image}

                alt={doctor.name}

              />



              {/* DETAILS */}

              <h2>

                {doctor.name}

              </h2>



              <h3>

                {
                  doctor.specialization
                }

              </h3>



              <p>

                {
                  doctor.experience
                }

              </p>



              {/* BUTTON */}

              <button
                onClick={
                  handleBookNow
                }
              >

                Book Appointment

              </button>

            </div>

          ))

        }

      </div>



      {/* ================= VIEW ALL ================= */}

      <div className="view-all">

        <button
          onClick={
            handleViewAll
          }
        >

          View All Doctors

        </button>

      </div>

    </section>
  );
}

export default FeaturedDoctors;