import { useEffect } from "react";
import { orderSuccessThunk } from "../../redux/order";
import { IOrderPreview } from "../../redux/types/order";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import "./CheckoutSuccess.css";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.session.user);
  const order: IOrderPreview | null = useAppSelector(
    (state) => state.order.order
  );

  const dispatch = useAppDispatch();
  const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const id = parseInt(orderId || "0", 10);
  if (isNaN(id)) {
    return <div className="error">Invalid Order ID</div>;
  }
  useEffect(() => {
    if (id) {
      dispatch(orderSuccessThunk(id) as any);
    }
  }, [id, dispatch]);

  if (!order) {
    return <div className="loading">Loading Order...</div>;
  }

  return (
    <div className="checkout-success-container">
      <div className='success-icon'>🔮</div>
      <div className="success-icon-reflection">🔮</div>

      <h1 className='success-header'>Thank you for your purchase!</h1>
      <p className="success-subtext">Your parcel has been summoned and will be delivered soon!</p>
      <p className="success-subtext">Order Number: {order.orderNumber}</p>
      {order ? (
        <div className="success-card">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Order Number: {order.orderNumber}</p>
          <p>Status: {order.status}</p>
          <p> Total: ${order.orderTotal.toFixed(2)}</p>
        </div>
      <div className="order-items">
        <h2>Order Items</h2>
        {order && order.items && order.items.length > 0 ? (
          <ul className="success-item-list">
            {order.items.map((item) => (
                <li key={item.itemId}>
                  <img
                    src={item.mainImageUrl}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      ${parseFloat(item.price.toFixed(2))} x {item.quantity}
                    </p>
                  </div>
                </li>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
        </div>
          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p>{order.shippingAddress.zip}</p>
          </div>
        </div>
      ) : (
        <div className="error">Accio order...</div>
      )}
  <button 
      className="checkout-button" 
      onClick={() => navigate('/items')}
    >
      Return to Market
    </button>
  </div>
);
};

export default CheckoutSuccess;
