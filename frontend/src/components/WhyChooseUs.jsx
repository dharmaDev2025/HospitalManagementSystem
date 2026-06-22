import "./../css/whyChooseUs.css";

import {

  FaUserMd,
  FaHospital,
  FaClock,
  FaHeartbeat,

} from "react-icons/fa";

function WhyChooseUs() {

  const data = [

    {

      icon: <FaUserMd />,

      number: "500+",

      title: "Expert Doctors",

    },



    {

      icon: <FaHospital />,

      number: "1000+",

      title: "Hospital Beds",

    },



    {

      icon: <FaClock />,

      number: "24/7",

      title: "Emergency Support",

    },



    {

      icon: <FaHeartbeat />,

      number: "50K+",

      title: "Happy Patients",

    },

  ];



  return (

    <section className="why-section">



      {/* ================= LEFT ================= */}

      <div className="why-left">

        <h1>

          Why Choose MediCare?

        </h1>



        <p>

          We provide world-class
          healthcare services with
          expert doctors, advanced
          technology, and emergency
          support for every patient.

        </p>



        <button>

          Explore More

        </button>

      </div>



      {/* ================= RIGHT ================= */}

      <div className="why-right">



        {

          data.map(

            (
              item,
              index
            ) => (

              <div

                className="why-card"

                key={index}

              >



                <div className="why-icon">

                  {item.icon}

                </div>



                <h2>

                  {item.number}

                </h2>



                <p>

                  {item.title}

                </p>

              </div>

            )

          )

        }

      </div>

    </section>
  );
}

export default WhyChooseUs;