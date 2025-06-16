import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import SingleItem from '../components/SingleItem/singleItem';
import LandingPage from '../components/Landing/Landing';
import Home from '../components/Home/home'

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
        element: <Home/>
      },
      {
        path: '/category/:categoryId/:subCategoryId/items/:itemId',
        element: <SingleItem/>
      }
    ],
  },
]);
