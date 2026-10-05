import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");

      return;
    }

    setLoading(true);

    try {
      const orderData = {
        name: formData.name,

        phone: formData.phone,

        address: formData.address,

        payment_method: formData.payment_method,

        cart: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const result = await placeOrder(orderData);

      clearCart();

      navigate(`/order-success/${result.order.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="page empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>Add some products before checking out.</p>

        <Link to="/menu">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* Checkout Form */}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery Information</h2>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <label>Delivery Address</label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your complete delivery address"
            rows="5"
            required
          />

          <h2>Payment Method</h2>

          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="COD"
                checked={formData.payment_method === "COD"}
                onChange={handleChange}
              />

              <div>
                <strong>Cash on Delivery</strong>

                <p>Pay when your order arrives.</p>
              </div>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="CARD"
                checked={formData.payment_method === "CARD"}
                onChange={handleChange}
              />

              <div>
                <strong>Card</strong>

                <p>Pay securely by card.</p>
              </div>
            </label>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order Summary */}

        <div className="checkout-summary">
          <h2>Your Order</h2>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>

                <p>Qty: {item.quantity}</p>
              </div>

              <span>
                ${(Number(item.final_price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
