import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Welcome to ThunderMart</h1>

        <p>
          Fresh and organic vegetables, attractive household materials,
          delivered right to your door.
        </p>

        <Link to="/menu" className="button">
          Shop Now
        </Link>
      </section>

      <section className="home-section">
        <h2>Why Choose ThunderMart?</h2>

        <div className="features">
          <div className="feature-card">
            <h3>🥦 Fresh & Organic</h3>
            <p>
              Fresh vegetables, household items, and all the groceries you need.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚀 Fast Delivery</h3>
            <p>Convenient delivery and pickup options available.</p>
          </div>

          <div className="feature-card">
            <h3>⭐ Great Service</h3>
            <p>We care about providing an excellent customer experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
