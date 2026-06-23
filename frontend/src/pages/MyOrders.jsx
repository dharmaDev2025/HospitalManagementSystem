import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/myOrders.css";

const MyOrders = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [orders, setOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/orders/user/${user._id}`,
        {
          headers: {
            role: "patient",
          },
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStepClass = (orderStatus, step) => {
    const steps = [
      "processing",
      "shipped",
      "out for delivery",
      "delivered",
    ];

    return steps.indexOf(step) <= steps.indexOf(orderStatus)
      ? "active-step"
      : "";
  };

  return (
    <>
      <Navbar />

      <div className="my-orders-page">
        <div className="my-orders-header">
          <h1>Track My Orders</h1>
          <p>View your medicine orders from present to past</p>
        </div>

        <div className="my-orders-list">
          {orders.length === 0 ? (
            <div className="no-orders">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div className="my-order-card" key={order._id}>
                <div className="order-top">
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="order-status">
                    {order.deliveryStatus}
                  </span>
                </div>

                <div className="order-medicines">
                  {order.medicines.map((med, index) => (
                    <div className="order-med" key={index}>
                      <span>{med.name || "Medicine"}</span>
                      <span>Qty: {med.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="tracking-steps">
                  <div className={getStepClass(order.deliveryStatus, "processing")}>
                    Processing
                  </div>

                  <div className={getStepClass(order.deliveryStatus, "shipped")}>
                    Shipped
                  </div>

                  <div className={getStepClass(order.deliveryStatus, "out for delivery")}>
                    Out for Delivery
                  </div>

                  <div className={getStepClass(order.deliveryStatus, "delivered")}>
                    Delivered
                  </div>
                </div>

                <div className="order-bottom">
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>

                  <p>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>

                  <p>
                    <strong>Payment:</strong> {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
