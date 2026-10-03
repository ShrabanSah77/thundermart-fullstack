import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <span>🛒</span>
        )}
      </div>

      <p className="product-brand">{product.brand || "ThunderMart"}</p>

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      {product.discount > 0 ? (
        <div className="price-section">
          <span className="old-price">${Number(product.price).toFixed(2)}</span>

          <strong className="sale-price">
            ${Number(product.final_price).toFixed(2)}
          </strong>

          <span className="discount">{product.discount}% OFF</span>
        </div>
      ) : (
        <strong>${Number(product.final_price).toFixed(2)}</strong>
      )}

      <button onClick={handleAddToCart} disabled={product.stock <= 0}>
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}

export default ProductCard;
