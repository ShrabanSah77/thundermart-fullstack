import OrderSuccess from "./pages/OrderSuccess";
<Route path="/order-success/:orderId" element={<OrderSuccess />} />;
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to place order");
  }

  return data;
}
