import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          ThunderMart
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/menu">Shop</Link>

          <Link to="/my-orders">My Orders</Link>

          <Link to="/login">Account</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
