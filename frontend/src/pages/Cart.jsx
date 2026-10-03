import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>You haven't added anything to your cart yet.</p>

        <Link to="/menu" className="button">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Shopping Cart</h1>

      <p>
        {cartCount} item
        {cartCount !== 1 ? "s" : ""} in your cart
      </p>

      <div className="cart-layout">
        {/* Cart Items */}

        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <span>🛒</span>
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>

                <p>{item.brand}</p>

                <strong>${Number(item.final_price).toFixed(2)}</strong>
              </div>

              {/* Quantity */}

              <div className="quantity-control">
                <button onClick={() => decreaseQuantity(item.id)}>−</button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>

              {/* Item Total */}

              <div className="item-total">
                <strong>
                  ${(Number(item.final_price) * item.quantity).toFixed(2)}
                </strong>
              </div>

              {/* Remove */}

              <button
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>

            <span>{cartCount}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <span>FREE</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
