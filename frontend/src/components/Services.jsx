import "./../css/services.css";

import {

  FaUserMd,
  FaFlask,
  FaPills,
  FaFileMedical,
  FaAmbulance,
  FaBed,
  FaTint,
  FaShieldAlt,

} from "react-icons/fa";

function Services() {

  const services = [

    {

      icon: <FaUserMd />,

      title: "Doctor Appointment",

      description:
        "Book appointments with experienced specialists.",

    },



    {

      icon: <FaFlask />,

      title: "Laboratory Tests",

      description:
        "Blood tests, MRI, CT Scan and diagnostics.",

    },



    {

      icon: <FaPills />,

      title: "Medicine Delivery",

      description:
        "Order medicines online with fast delivery.",

    },



    {

      icon: <FaFileMedical />,

      title: "Medical Reports",

      description:
        "View and download reports securely anytime.",

    },



    {

      icon: <FaAmbulance />,

      title: "Emergency Ambulance",

      description:
        "24/7 emergency ambulance support service.",

    },



    {

      icon: <FaBed />,

      title: "Bed Booking",

      description:
        "Check and reserve hospital beds online.",

    },



    {

      icon: <FaTint />,

      title: "Blood Bank",

      description:
        "Emergency blood availability and donation.",

    },



    {

      icon: <FaShieldAlt />,

      title: "Insurance Support",

      description:
        "Cashless treatment and insurance assistance.",

    },

  ];



  return (

    <section
      className="services-section"
      id="services"
    >



      {/* ================= TITLE ================= */}

      <div className="services-title">

        <h1>

          Our Hospital Services

        </h1>



        <p>

          Comprehensive healthcare
          services for every patient.

        </p>

      </div>



      {/* ================= CARDS ================= */}

      <div className="services-grid">



        {

          services.map(

            (
              service,
              index
            ) => (

              <div

                className="service-card"

                key={index}

              >



                <div className="service-icon">

                  {service.icon}

                </div>



                <h2>

                  {service.title}

                </h2>



                <p>

                  {
                    service.description
                  }

                </p>

              </div>

            )

          )

        }

      </div>

    </section>
  );
}

export default Services;