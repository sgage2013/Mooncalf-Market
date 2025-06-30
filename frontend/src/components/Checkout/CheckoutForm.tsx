import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { createOrderThunk } from "../../redux/order";


function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://mooncalf-market.onrender.com";

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
}, [user, navigate]);

      const fetchClientSecret = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/checkout/create-payment-intent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (res.ok && data.clientSecret) {
            console.log("Client secret:", data.clientSecret);
            setClientSecret(data.clientSecret);
          }
        } catch (error) {
          console.log(error)
          setErrors("Failed to connect to payment server");
        }
      };
        fetchClientSecret(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(false);

    if (!stripe || !elements || !clientSecret) {
        setErrors("Unable to load Stripe");
      setIsLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrors("Card element not found.");
      setIsLoading(false);
      return;
    }
    const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(clientSecret!, {
        payment_method: {
            card: cardElement,
        },
    });
    if (stripeError) {
      setErrors("Invalid card details");
      setIsLoading(false);
      return;
    }
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setErrors("Payment failed");
      setIsLoading(false);
      return;
    }

    const createdOrder = await dispatch (createOrderThunk(paymentIntent.id));
    if (createdOrder?.id) {
        navigate(`/checkout/success/${createdOrder.id}`);
    } else {
        setErrors("Failed to create order");
    }
  };

  

  return (
    <div className='checkout-form'>
    <h2>Checkout</h2>
    <p>Please enter your payment details.</p>
    <p>Demo card numbers are provided below</p>
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Pay"}
      </button>
      {errors && <div>{errors}</div>}
    </form>
    </div>
  );
}

export default CheckoutForm;