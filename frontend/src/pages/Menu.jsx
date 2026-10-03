function Menu() {
  return (
    <div className="page">
      <h1>Our Menu</h1>

      <p>Browse our delicious food and drinks.</p>

      <div className="products">
        <div className="product-card">
          <div className="product-image">🍔</div>

          <h3>Classic Burger</h3>

          <p>Delicious burger with fresh vegetables and sauce.</p>

          <strong>$12.99</strong>

          <button>Add to Cart</button>
        </div>

        <div className="product-card">
          <div className="product-image">🍕</div>

          <h3>Cheese Pizza</h3>

          <p>Fresh pizza topped with delicious melted cheese.</p>

          <strong>$14.99</strong>

          <button>Add to Cart</button>
        </div>

        <div className="product-card">
          <div className="product-image">🍟</div>

          <h3>French Fries</h3>

          <p>Crispy golden fries.</p>

          <strong>$5.99</strong>

          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
