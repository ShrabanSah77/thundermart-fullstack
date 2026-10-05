import { Link, useParams } from "react-router-dom";

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="page order-success">
      <div className="success-icon">✓</div>

      <h1>Order Placed Successfully!</h1>

      <p>Thank you for shopping with ThunderMart.</p>

      <div className="order-number">
        <span>Order Number</span>

        <strong>#{orderId}</strong>
      </div>

      <p>We have received your order and will begin processing it shortly.</p>

      <div className="success-actions">
        <Link to="/my-orders">View My Orders</Link>

        <Link to="/menu">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
