import { useState, useEffect, useCallback } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { createOrderThunk } from "../../redux/order";
import { csrfFetch } from "../../redux/csrf";
import "./CheckoutForm.css";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://mooncalf-market.onrender.com";
  

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await csrfFetch(
        `${backendUrl}/api/checkout/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      setErrors("Failed to connect to payment server");
    }
  }, [backendUrl, csrfFetch]);

  useEffect(() => {
    if (user && stripe && !clientSecret) {
      fetchClientSecret();
    }
  }, [user, stripe, clientSecret, fetchClientSecret]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(false);

    if (!stripe || !elements || !clientSecret) {
      setErrors("Unable to load Stripe");
      setIsLoading(false);
      return;
    }
    if (!address || !city || !state || !zip || zip.length < 5) {
      setErrors("Please enter a valid address");
      setIsLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrors("Card element not found.");
      setIsLoading(false);
      return;
    }
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret!, {
        payment_method: {
          card: cardElement,
        },
      });
    if (stripeError) {
      if(stripeError.decline_code === 'insufficient_funds') {
        setErrors("Insufficient funds, please try a different card.");
      } else if (stripeError.decline_code === 'generic_decline') {
        setErrors("Payment declined, please try a different card.");
      } else {
      setErrors("Invalid card details");
    }
    setIsLoading(false);
    return;
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setErrors("Payment failed");
      setIsLoading(false);
      return;
    }

    const shippingInfo = {
      address,
      city,
      state,
      zip,
    };

    const createdOrder = await (dispatch as any)(
      createOrderThunk(paymentIntent.id, shippingInfo)
    );
    if (createdOrder?.id) {
      navigate(`/checkout/success/${createdOrder.id}`);
      setAddress("");
      setCity("");
      setState("");
      setZip("");
      setErrors(null);
      setIsLoading(false);
    } else {
      setErrors("Failed to create order");
    }
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      <p>Please enter your payment details.</p>
      <p>Demo card numbers are provided below</p>
      <form onSubmit={handleSubmit}>
        <CardElement />
        {errors && <div>{errors}</div>}
        <div className="demo-cards">
          <h3>Demo Card Numbers</h3>
          <ul>
            <li>
              Success: 4242 4242 4242 4242
              <br />
              Exp: 12/34
              <br />
              CVC: 123
              <br />
              Zip: 12345
            </li>
            <li>
              Declined: 4000 0000 0000 0002
              <br />
              Exp: 12/34
              <br />
              CVC: 123
              <br />
              Zip: 12345
            </li>
            <li>
              Insufficient Funds: 4000 0000 0000 9995
              <br />
              Exp: 12/34
              <br />
              CVC: 123
              <br />
              Zip: 12345
            </li>
          </ul>
        </div>
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
          <label>
            Zip Code:
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
