import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/medicine.css";

const Medicines = () => {
  const BASE_URL = "http://localhost:5000";

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [medicines, setMedicines] = useState([]);
  const [bag, setBag] = useState([]);
  const [showBag, setShowBag] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [addedItem, setAddedItem] = useState("");

  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/medicines`);
      setMedicines(data.medicines || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const getImageUrl = (medicine) => {
    return medicine.image
      ? medicine.image
      : "https://via.placeholder.com/300x200?text=Medicine";
  };

  const getStock = (medicine) => {
    return medicine.stock || 0;
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const addToBag = (medicine) => {
    const stock = getStock(medicine);

    const existingItem = bag.find(
      (item) => item._id === medicine._id
    );

    const currentQty = existingItem?.quantity || 0;

    if (currentQty >= stock) {
      return alert(`Only ${stock} available`);
    }

    if (existingItem) {
      setBag(
        bag.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setBag([...bag, { ...medicine, quantity: 1 }]);
    }

    setAddedItem(medicine._id);
    showMessage(`${medicine.name} added to bag`);

    setTimeout(() => {
      setAddedItem("");
    }, 1500);
  };

  const decreaseQty = (id) => {
    setBag(
      bag
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setBag(bag.filter((item) => item._id !== id));
  };

  const totalAmount = bag.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const openCheckout = () => {
    if (bag.length === 0) {
      return alert("Bag is empty");
    }

    if (!user._id) {
      return alert("Please login first");
    }

    setShowCheckout(true);
  };

  const payNow = async () => {
    try {
      if (!address.trim()) {
        return alert("Please enter delivery address");
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/payment/checkout`,
        {
          userId: user._id,
          address,
          medicines: bag.map((item) => ({
            medicineId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
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
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <>
      <Navbar />

      {message && (
        <div className="success-toast">
          ✅ {message}
        </div>
      )}

      <div className="medicine-page">
        <div className="medicine-header">
          <div>
            <h1>Medicines</h1>
            <p>Choose medicines added by admin and add them to your bag.</p>
          </div>

          <div className="bag-count" onClick={() => setShowBag(true)}>
            🛒 Bag ({bag.length})
          </div>
        </div>

        <div className="medicine-grid">
          {medicines.length === 0 ? (
            <div className="empty-box">No medicines available</div>
          ) : (
            medicines.map((medicine) => {
              const stock = getStock(medicine);

              return (
                <div className="medicine-card" key={medicine._id}>
                  <div className="medicine-img-box">
                    <img src={getImageUrl(medicine)} alt={medicine.name} />
                  </div>

                  <div className="medicine-content">
                    <h3>{medicine.name}</h3>

                    <p>{medicine.description || "No description available"}</p>

                    <div className="category-tag">
                      {medicine.category || "General"}
                    </div>

                    <div className="medicine-info">
                      <span className="price">₹{medicine.price}</span>

                      <span className={stock > 0 ? "stock" : "stock out"}>
                        {stock > 0 ? `${stock} Available` : "Out Of Stock"}
                      </span>
                    </div>

                    <button
                      disabled={stock <= 0}
                      onClick={() => addToBag(medicine)}
                      className={addedItem === medicine._id ? "added-btn" : ""}
                    >
                      {stock <= 0
                        ? "Unavailable"
                        : addedItem === medicine._id
                        ? "✓ Added To Bag"
                        : "Add To Bag"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showBag && (
          <div className="modal-overlay">
            <div className="bag-modal">
              <div className="bag-modal-header">
                <h2>🛒 My Bag</h2>
                <button onClick={() => setShowBag(false)}>✕</button>
              </div>

              {bag.length === 0 ? (
                <div className="empty-bag">No medicines added</div>
              ) : (
                <>
                  <div className="bag-list">
                    {bag.map((item) => (
                      <div className="bag-item" key={item._id}>
                        <img src={getImageUrl(item)} alt={item.name} />

                        <div className="bag-info">
                          <h4>{item.name}</h4>
                          <p>₹{item.price}</p>

                          <div className="qty-box">
                            <button onClick={() => decreaseQty(item._id)}>
                              -
                            </button>

                            <span>{item.quantity}</span>

                            <button onClick={() => addToBag(item)}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className="bag-price">
                          <strong>
                            ₹{Number(item.price) * Number(item.quantity)}
                          </strong>

                          <button
                            className="remove-btn"
                            onClick={() => removeItem(item._id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bag-total">
                    <span>Total</span>
                    <strong>₹{totalAmount}</strong>
                  </div>

                  <button className="order-btn" onClick={openCheckout}>
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {showCheckout && (
          <div className="modal-overlay">
            <div className="bag-modal">
              <div className="bag-modal-header">
                <h2>Checkout</h2>
                <button onClick={() => setShowCheckout(false)}>✕</button>
              </div>

              <textarea
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="bag-total">
                <span>Total Amount</span>
                <strong>₹{totalAmount}</strong>
              </div>

              <button className="order-btn" onClick={payNow}>
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Medicines;