import "./../css/footer.css";

import {

  FaHeartbeat,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,

} from "react-icons/fa";

function Footer() {

  return (

    <footer className="footer">



      {/* ================= TOP ================= */}

      <div className="footer-top">



        {/* ================= LOGO SECTION ================= */}

        <div className="footer-box">

          <div className="footer-logo">

            <FaHeartbeat />

            <h1>

              MediCare

            </h1>

          </div>



          <p>

            Providing trusted healthcare
            services with expert doctors,
            advanced laboratories, and
            emergency support.

          </p>



          {/* SOCIAL */}

          <div className="social-icons">

            <span>

              <FaFacebookF />

            </span>



            <span>

              <FaInstagram />

            </span>



            <span>

              <FaTwitter />

            </span>



            <span>

              <FaLinkedinIn />

            </span>

          </div>

        </div>



        {/* ================= QUICK LINKS ================= */}

        <div className="footer-box">

          <h2>

            Quick Links

          </h2>



          <ul>

            <li>

              Home

            </li>



            <li>

              Doctors

            </li>



            <li>

              Laboratory

            </li>



            <li>

              Medicines

            </li>



            <li>

              Contact

            </li>

          </ul>

        </div>



        {/* ================= SERVICES ================= */}

        <div className="footer-box">

          <h2>

            Services

          </h2>



          <ul>

            <li>

              Doctor Appointment

            </li>



            <li>

              Laboratory Tests

            </li>



            <li>

              Ambulance Service

            </li>



            <li>

              Blood Bank

            </li>



            <li>

              Insurance Support

            </li>

          </ul>

        </div>



        {/* ================= CONTACT ================= */}

        <div className="footer-box">

          <h2>

            Contact Us

          </h2>



          <p>

            <FaPhoneAlt />

            +91 9876543210

          </p>



          <p>

            <FaEnvelope />

            medicare@gmail.com

          </p>



          <p>

            <FaMapMarkerAlt />

            Bhubaneswar, Odisha

          </p>

        </div>

      </div>



      {/* ================= BOTTOM ================= */}

      <div className="footer-bottom">

        <p>

          © 2026 MediCare.
          All Rights Reserved.

        </p>

      </div>

    </footer>
  );
}

export default Footer;