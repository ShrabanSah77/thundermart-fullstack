import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();

      setProducts(data.products);
    } catch (error) {
      console.error(error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Shop</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Shop</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Shop</h1>

      <p>Browse products available at ThunderMart.</p>

      <div className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">🛒</div>

            <h3>{product.name}</h3>

            <p>{product.description}</p>

            <strong>${product.price.toFixed(2)}</strong>

            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
