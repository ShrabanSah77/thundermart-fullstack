function Checkout() {
  return (
    <div className="page">
      <h1>Checkout</h1>

      <p>Complete your order below.</p>

      <form className="checkout-form">
        <input type="text" placeholder="Full Name" />

        <input type="text" placeholder="Phone Number" />

        <input type="text" placeholder="Delivery Address" />

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
