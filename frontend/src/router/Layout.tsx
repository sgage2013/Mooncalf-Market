import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { getCategoriesThunk } from "../redux/categories";
import Navigation from "../components/Navigation/Navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RYiLeGsLIzRMXOp1GxJZKLeIGfSQjGJshMyTXhZcQD6FF8cPOAPKvXHMUJCornjSmBFn9wvcTgBCsvvRnpwbmEU00SeJChFll"
);
const appearance = {
  theme: "stripe" as "stripe",
  variables: {
    fontFamily: "Arial, sans-serif",
    borderRadius: "8px",
    fontSize: "16px",
    colorPrimary: "#000000",
    colorBackground: "#ffffff",
    colorText: "#000000",
    colorDanger: "#ff0000",
    colorTextPlaceholder: "#505050",
    iconColor: "#000000",
    iconCardErrorColor: "#ff0000",
  },
};

export default function Layout(): JSX.Element {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  const hideNav = ["/", "/login", "/signup"];
  const hasNav = hideNav.includes(location.pathname);

  useEffect(() => {
    dispatch(thunkAuthenticate())
      .then(() => {
        return dispatch(getCategoriesThunk());
      })
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        {!hasNav && <Navigation />}
        <Elements stripe={stripePromise} options={{ appearance }}>
          {isLoaded && <Outlet />}
        </Elements>
        <Modal />
      </ModalProvider>
    </>
  );
}
