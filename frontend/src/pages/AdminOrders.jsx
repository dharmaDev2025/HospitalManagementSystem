import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";

import "./../css/adminOrders.css";

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  // ================= FETCH ORDERS =================

  const fetchOrders =
    async () => {

      try {

        const res =
          await axios.get(

            "https://hospitalmanagementsystem-nz84.onrender.com/api/orders/all",

            {

              headers: {

                role: "admin",

              },
            }
          );

        setOrders(
          res.data.orders
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to fetch orders"
        );
      }
    };

  useEffect(() => {

    fetchOrders();

  }, []);

  // ================= UPDATE STATUS =================

  const updateStatus =
    async (id, status) => {

      try {

        await axios.put(

          `https://hospitalmanagementsystem-nz84.onrender.com/api/orders/status/${id}`,

          {

            deliveryStatus:
              status,

          },

          {

            headers: {

              role: "admin",

            },
          }
        );

        alert(
          "Status Updated"
        );

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          "Update Failed"
        );
      }
    };

  return (
    <>
      <Navbar />

      <div className="admin-orders-container">

        {/* ================= HEADER ================= */}

        <div className="orders-top-bar">

          <h1>
            Medicine Orders
          </h1>

        </div>

        {/* ================= ORDERS ================= */}

        <div className="orders-grid">

          {orders.length > 0 ? (

            orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                {/* USER */}

                <div className="order-user">

                  <h3>
                    {
                      order.userId
                        ?.name
                    }
                  </h3>

                  <p>
                    {
                      order.userId
                        ?.email
                    }
                  </p>

                </div>

                {/* ADDRESS */}

                <div className="order-section">

                  <strong>
                    Address:
                  </strong>

                  <p>
                    {
                      order.address
                    }
                  </p>

                </div>

                {/* MEDICINES */}

                <div className="order-section">

                  <strong>
                    Medicines:
                  </strong>

                  {order.medicines.map(

                    (
                      med,
                      index
                    ) => (

                      <div

                        key={
                          index
                        }

                        className="medicine-item"
                      >

                        <span>
                          {
                            med.name
                          }
                        </span>

                        <span>
                          Qty:
                          {" "}
                          {
                            med.quantity
                          }
                        </span>

                      </div>
                    )
                  )}

                </div>

                {/* TOTAL */}

                <div className="order-section">

                  <strong>
                    Total:
                  </strong>

                  <p>
                    ₹
                    {" "}
                    {
                      order.totalAmount
                    }
                  </p>

                </div>

                {/* PAYMENT */}

                <div className="order-section">

                  <strong>
                    Payment:
                  </strong>

                  <p className="payment-status">
                    {
                      order.paymentStatus
                    }
                  </p>

                </div>

                {/* DELIVERY STATUS */}

                <div className="order-section">

                  <strong>
                    Delivery Status:
                  </strong>

                  <select

                    value={
                      order.deliveryStatus
                    }

                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="out for delivery">
                      Out For Delivery
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                  </select>

                </div>

              </div>
            ))
          ) : (

            <h2 className="no-orders">
              No Orders Found
            </h2>
          )}

        </div>

      </div>
    </>
  );
}

export default AdminOrders;
