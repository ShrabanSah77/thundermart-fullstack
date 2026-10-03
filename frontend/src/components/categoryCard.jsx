function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <div className="category-icon">🛒</div>

      <h3>{category.name}</h3>

      <p>{category.product_count} products</p>
    </div>
  );
}

export default CategoryCard;
