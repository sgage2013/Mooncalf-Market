import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { getCategoriesThunk } from "../redux/categories";
import Navigation from "../components/Navigation/Navigation";

export default function Layout():JSX.Element {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  const hideNav = ['/', '/login', '/signup']
  const hasNav = hideNav.includes(location.pathname)

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    dispatch(getCategoriesThunk())
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
