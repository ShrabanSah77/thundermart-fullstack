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

export async function placeOrder(orderData) {
  const response = await fetch("/api/checkout/", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(orderData),
  });

  const text = await response.text();

  console.log("===== CHECKOUT DEBUG =====");
  console.log("Status:", response.status);
  console.log("URL:", response.url);
  console.log("Response:", text);
  console.log("==========================");

  if (!response.ok) {
    throw new Error(
      `Checkout failed (${response.status}): ${text.substring(0, 200)}`,
    );
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Server returned non-JSON response (${response.status}).`);
  }
}
