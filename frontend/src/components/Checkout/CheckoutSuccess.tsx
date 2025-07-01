import {useEffect } from 'react';
import { orderSuccessThunk } from '../../redux/order';
import { IOrderPreview }from "../../redux/types/order";
import {useParams, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.session.user);
    const order: IOrderPreview | null = useAppSelector((state) => state.order.order);
    const dispatch = useAppDispatch();
    const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    if (!user){
        navigate('/login');
    }
  }, [user, navigate]);

  const id = parseInt(orderId || '0', 10);
  if (isNaN(id)) {
    return <div className="error">Invalid Order ID</div>;
  }
  useEffect(() => {
    if(id) {
        dispatch(orderSuccessThunk(id) as any);
    }
  }, [id, dispatch]);

  if(!order){
    console.log('order:', order);
    return <div className="loading">Loading Order...</div>;
  }

  return (
    <div className="checkout-success-container">
      <h1>Thank you for your purchase!</h1>
      {order && (
        <div className="order-summary">
          <h2>Order Summary</h2>
            <p>Order Number: {order.orderNumber}</p>
            <p>Status: {order.status}</p>
            <p> Total: ${order.orderTotal.toFixed(2)}</p>
        </div>
      )}
      <div className='shipping-info'>
        {order && (
          <div>
            <h2>Shipping Information</h2>
            <p>Address: {order.shippingAddress.address}</p>
            <p>City: {order.shippingAddress.city}</p>
            <p>State: {order.shippingAddress.state}</p>
            <p>Zip: {order.shippingAddress.zip}</p>
          </div>
        )}
      </div>
      <div className='order-items'>
        <h2>Order Items</h2>
        {order && order.items && order.items.length > 0 ? (
          <ul>
            {order.items.map((item) => (
              <div>
                <li key={item.itemId}>
                  <p>{item.name}</p>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
