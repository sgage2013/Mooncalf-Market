import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ICartState, ICartItem } from "../../redux/types/cart";
import { getCartItemsThunk } from "../../redux/cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OpenModalButton from "../OpenModalButton";
import CheckoutForm from "./CheckoutForm";
import "./Checkout.css";

console.log("My Key is:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function Checkout() {
  const user = useAppSelector((state) => state.session.user);
  const dispatch: any = useAppDispatch();
  const navigate = useNavigate();
  const cartState: ICartState = useAppSelector((state) => state.cart);
  const cartItems: ICartItem[] = cartState.cart?.cartItems || [];
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!cartState.cart) {
      dispatch(getCartItemsThunk());
    }
  }, [cartState.cart, dispatch]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setErrors(
        "Your cart is empty. Please add items before proceeding to checkout.",
      );
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowForm(true);
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (errors) {
    setErrors(errors);
  }

  return (
    <div className="checkout-container">
      <div className="checkout-layout">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((cartItem) => (
              <div key={cartItem.id} className="order-item">
                <img
                  src={cartItem.item.mainImageUrl}
                  alt={cartItem.item.name}
                />
                <div className="item-details">
                  <p className="item-name">{cartItem.item.name}</p>
                  <p className="item-quantity">Quantity: {cartItem.quantity}</p>
                </div>
                <p className="item-price">
                  $
                  {typeof cartItem.item.price === "string"
                    ? parseFloat(cartItem.item.price).toFixed(2)
                    : cartItem.item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="order-total">
            <p>Items: {totalItems}</p>
            <p>
              Subtotal: <span>${cartState.subTotal.toFixed(2)}</span>
            </p>
            <p>
              Shipping: <span>${cartState.shipping.toFixed(2)}</span>
            </p>
            <p>
              Tax: <span>${cartState.tax.toFixed(2)}</span>
            </p>
            <div className="order-total-amount">
              <p>
                <span>Total:</span>
                <span>
                  $
                  {cartItems
                    .reduce(
                      (total, item) => total + item.item.price * item.quantity,
                      0,
                    )
                    .toFixed(2)}
                </span>
              </p>
            </div>
          </div>
         <div className="checkout-details">
          {/* <h2> Payment Information</h2> */}
          {errors && <p className="error">{errors}</p>}
          {/* <form onSubmit={handleSubmit}> */}
          <OpenModalButton
    buttonText="Place Order"
    modalComponent={<Elements stripe ={stripePromise}><CheckoutForm /></Elements>}
    onModalClose={() => {}}
/>
          {/* </form> */}
        </div>
        </div>
      </div>
    </div>
  );
}
export default Checkout;
