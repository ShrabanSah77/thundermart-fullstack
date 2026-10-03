function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Welcome to ThunderMart</h1>

        <p>
          Fresh and organin vegetables, Attractive Household materials,
          delivered right to your door.
        </p>

        <a href="/menu" className="button">
          Order Now
        </a>
      </section>

      <section className="home-section">
        <h2>Why Choose ThunderMart?</h2>

        <div className="features">
          <div className="feature-card">
            <h3>Fresh and Organic vegetables</h3>
            <p>
              Numbers of household items and all the type of groceries you need.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚀 Fast Delivery option</h3>
            <p>Pickup option in your convinent time.</p>
          </div>

          <div className="feature-card">
            <h3>⭐ Great Service</h3>
            <h3>⭐ Awesome Products</h3>
            <p>We care about providing an excellent customer experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
