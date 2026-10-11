import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";

// Checkout Funtions

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkLogin() {
      try {
        const response = await fetch("/api/current-user/", {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();

          if (data.logged_in) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);

            navigate("/login?next=/checkout", {
              replace: true,
              state: {
                message:
                  "First Login Required: Please log in to continue to checkout.",
              },
            });
          }
        } else {
          navigate("/login?next=/checkout", { replace: true });
        }
      } catch (error) {
        if (!cancelled) {
          setError("Unable to verify your login. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setCheckingLogin(false);
        }
      }
    }

    checkLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isLoggedIn) {
      navigate("/login?next=/checkout");
      return;
    }

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
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const customerResponse = await fetch("/api/customer-details/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const customerResult = await customerResponse.json();

      if (!customerResponse.ok) {
        throw new Error(
          customerResult.error || "Could not save customer details.",
        );
      }

      const result = await placeOrder(orderData);

      clearCart();

      const orderId = result.order?.id ?? result.order_id;

      if (!orderId) {
        throw new Error("Order was submitted, but no order ID was returned.");
      }

      navigate(`/order-success/${orderId}`);
    } catch (error) {
      setError(error.message || "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingLogin) {
    return (
      <div className="page">
        <h1>Checking your account...</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="page">
        <h1>Login Required</h1>
        <p>Please log in to continue to checkout.</p>
        <p>Redirecting you to the login page...</p>
      </div>
    );
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

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
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

// Loggin Effect

useEffect(() => {
  if (!isLoggedIn) return;

  let cancelled = false;

  async function loadCustomerDetails() {
    try {
      const response = await fetch("/api/customer-details/", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load customer details.");
      }

      if (!cancelled) {
        setFormData((previous) => ({
          ...previous,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        }));
      }
    } catch (error) {
      if (!cancelled) {
        setError(error.message || "Could not load customer details.");
      }
    }
  }

  loadCustomerDetails();

  return () => {
    cancelled = true;
  };
}, [isLoggedIn]);

export default Checkout;
