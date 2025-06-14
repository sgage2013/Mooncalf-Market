import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout():JSX.Element {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  console.log('current location', location.pathname)

  const hideNav = ['/', '/login', '/signup']
  const hasNav = hideNav.includes(location.pathname)

  useEffect(() => {
    console.log('dispatching thunkAuthenticate')
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        {!hasNav && <Navigation />}
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
