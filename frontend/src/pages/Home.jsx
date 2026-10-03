function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Welcome to ThunderMart</h1>

        <p>Delicious food, delivered right to your door.</p>

        <a href="/menu" className="button">
          Order Now
        </a>
      </section>

      <section className="home-section">
        <h2>Why Choose ThunderMart?</h2>

        <div className="features">
          <div className="feature-card">
            <h3>🍔 Fresh Food</h3>
            <p>Freshly prepared meals made with quality ingredients.</p>
          </div>

          <div className="feature-card">
            <h3>🚀 Fast Delivery</h3>
            <p>Get your favorite food delivered quickly.</p>
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
