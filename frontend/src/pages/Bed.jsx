import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/bed.css";

const Bed = () => {
  const BASE_URL = "http://localhost:5000";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [beds, setBeds] = useState([]);

  const fetchBeds = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/beds`
      );

      setBeds(data.beds || []);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const getBedPrice = (bedType) => {
    switch (bedType) {
      case "ICU":
        return 5000;

      case "private":
        return 3000;

      default:
        return 1000;
    }
  };

  const bookBed = async (bed) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/payment/bed-checkout`,
        {
          userId: user._id,
          bedId: bed._id,
          bedNumber: bed.bedNumber,
          bedType: bed.bedType,
          totalAmount: getBedPrice(
            bed.bedType
          ),
        },
        {
          headers: {
            role: "patient",
          },
        }
      );

      window.location.href = data.url;

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Payment failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="bed-page">

        <div className="bed-header">

          <div>
            <h1>Hospital Bed Booking</h1>

            <p>
              Book a hospital bed with
              secure online payment
            </p>
          </div>

          <div className="bed-icon">
            🛏️
          </div>

        </div>

        <div className="bed-grid">

          {beds.length === 0 ? (

            <div className="empty-bed">
              No Beds Available
            </div>

          ) : (

            beds.map((bed) => (

              <div
                key={bed._id}
                className={`bed-card ${bed.status}`}
              >

                <div className="bed-top">

                  <h2>
                    Bed {bed.bedNumber}
                  </h2>

                  <span
                    className={`status ${bed.status}`}
                  >
                    {bed.status}
                  </span>

                </div>

                <p>
                  <strong>
                    Ward:
                  </strong>{" "}
                  {bed.wardType}
                </p>

                <p>
                  <strong>
                    Room:
                  </strong>{" "}
                  {bed.roomNumber}
                </p>

                <p>
                  <strong>
                    Floor:
                  </strong>{" "}
                  {bed.floor}
                </p>

                <p>
                  <strong>
                    Bed Type:
                  </strong>{" "}
                  {bed.bedType}
                </p>

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ₹
                  {getBedPrice(
                    bed.bedType
                  )}
                </p>

                {bed.notes && (
                  <p>
                    <strong>
                      Notes:
                    </strong>{" "}
                    {bed.notes}
                  </p>
                )}

                <button
                  disabled={
                    bed.status !==
                    "vacant"
                  }
                  onClick={() =>
                    bookBed(bed)
                  }
                >
                  {bed.status ===
                  "vacant"
                    ? "Book Now"
                    : "Not Available"}
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Bed;