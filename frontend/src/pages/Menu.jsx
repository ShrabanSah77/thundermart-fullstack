import { useEffect, useState } from "react";

import { getProducts, getCategories } from "../services/api";

import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/categoryCard";

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStore() {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productData.products);
        setCategories(categoryData.categories);
      } catch (error) {
        console.error(error);

        setError("Unable to load ThunderMart products.");
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>ThunderMart Shop</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>ThunderMart Shop</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Shop at ThunderMart</h1>

      <p>Find everything you need for your home.</p>

      {/* Categories */}

      <section>
        <h2>Shop by Category</h2>

        <div className="categories">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Products */}

      <section>
        <h2>All Products</h2>

        <div className="products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Menu;
