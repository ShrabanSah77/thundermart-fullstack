import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    async function loadData() {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();

        console.log("Products:", productsData);
        console.log("Categories:", categoriesData);

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : productsData.products || productsData.results || [],
        );
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.categories || categoriesData.results || [],
        );
      } catch (error) {
        console.error("Failed to load shop data:", error);
      }
    }

    loadData();
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const filteredProducts = products.filter((product) => {
    if (!query) {
      return true;
    }

    return (
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page">
      <h1>
        {searchQuery ? `Search results for "${searchQuery}"` : "Shop Products"}
      </h1>

      {searchQuery && (
        <p>
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      )}

      {!searchQuery && categories.length > 0 && (
        <div className="categories">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div className="category-icon">🛒</div>

              <h3>{category.name}</h3>

              {category.description && <p>{category.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">🛒</div>

              <h3>{product.name}</h3>

              {product.description && <p>{product.description}</p>}

              <strong>${product.price}</strong>
            </div>
          ))
        ) : (
          <div className="empty-cart">
            <h2>No products found</h2>

            <p>We couldn't find any products matching "{searchQuery}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
