import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(`/menu?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          ThunderMart
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

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
