const API_BASE_URL = "/api";

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories/`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
