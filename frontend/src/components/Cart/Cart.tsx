import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  getCartItemsThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from "../../redux/cart";
import { ICartItem, ICartState } from "../../redux/types/cart";
import CartItem  from "./CartItem";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const cartState: ICartState = useAppSelector((state) => state.cart);
  const cartItems: ICartItem[] = cartState.cart?.cartItems || [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(getCartItemsThunk());
    setLoading(false);
  }, [dispatch]);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    } else {
      dispatch(updateCartItemThunk(itemId, quantity));
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCartThunk(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCartThunk());
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-container">
      <h1>Your Wares</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
        <p>Your knapsack is empty.</p>
        <NavLink to={"/home"} className="nav-link">
          Time to visit the shops
        </NavLink>
        </div>
      ) : (
        <div className="cart-contents">
          <div className="cart-summary">
            {cartItems.map((item: ICartItem) => (
              <CartItem 
              key={item.id} 
              cartItem={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
            />
            ))}
          </div>
          <div className="cart-totals">
            <h2>Cart Totals</h2>
            <p>Subtotal: ${cartState.subTotal.toFixed(2)}</p>
            <p>Tax: ${cartState.tax.toFixed(2)}</p>
            <p>Shipping: ${cartState.shipping.toFixed(2)}</p>
            <p>Order Total: ${cartState.orderTotal.toFixed(2)}</p>
            <button className="checkout-button" onClick={() => navigate("/checkout")}>Checkout</button>
            <button className="empty-knapsack-button" onClick={handleClearCart}>Empty Knapsack</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;