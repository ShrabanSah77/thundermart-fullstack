import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    checkLogin();
    setShowProfile(false);
  }, [location.pathname]);

  useEffect(() => {
    setShowProfile(false);
  }, [location.pathname]);

  const checkLogin = async () => {
    try {
      const response = await fetch("/api/current-user/", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.logged_in ? data : null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check login:", error);
      setUser(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(`/menu?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);

        setUser(null);
        setShowProfile(false);

        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
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

          <button type="submit">🔍</button>
        </form>

        <div className="nav-links">
          <Link to="/" onClick={() => setShowProfile(false)}>
            Home
          </Link>

          <Link to="/menu" onClick={() => setShowProfile(false)}>
            Shop
          </Link>

          <Link to="/my-orders" onClick={() => setShowProfile(false)}>
            My Orders
          </Link>

          {/* Account / Profile */}
          <div className="profile-container">
            {user ? (
              <>
                <button
                  className="profile-button"
                  onClick={() => setShowProfile(!showProfile)}
                  title="Profile"
                >
                  👤
                </button>

                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <strong>{user.username}</strong>
                      <span>{user.email}</span>
                    </div>

                    <Link to="/profile" onClick={() => setShowProfile(false)}>
                      Profile
                    </Link>

                    <Link to="/my-orders" onClick={() => setShowProfile(false)}>
                      My Orders
                    </Link>

                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="account-link">
                Account
              </Link>
            )}
          </div>

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
