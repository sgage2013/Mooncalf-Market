import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import SingleItem from "../components/SingleItem/singleItem";
import LandingPage from "../components/Landing/Landing";
import Home from "../components/Home/home";
import CategoryPage from "../components/Categories/Categories";
import SubcategoryItems from "../components/SubCategories/Subcategories";
import GetAllReviews from "../components/Reviews/getAllReviews";
import Cart from "../components/Cart/Cart";
import Checkout from "../components/CheckoutSuccess.css/Checkout";
import CheckoutForm from "../components/CheckoutSuccess.css/CheckoutForm";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginFormPage />,
      },
      {
        path: "/signUp",
        element: <SignupFormPage />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/category/:categoryId/:subCategoryId/items/:itemId",
        element: <SingleItem />,
      },
      {
        path: "/category/:categoryId",
        element: <CategoryPage />,
      },
      {
        path: "/category/:categoryId/:subCategoryId/items",
        element: <SubcategoryItems />,
      },
      {
        path: "/items/:itemId/reviews",
        element: <GetAllReviews />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      { 
        path: "/checkout/create-payment-intent",
        element: <CheckoutForm />
      },
    ],
  },
]);
