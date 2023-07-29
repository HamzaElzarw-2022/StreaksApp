import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from './views/login';
import Signup from './views/signup';
import HomePage from './views/homePage';

import "bootstrap/dist/css/bootstrap.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/homepage",
        element: <HomePage />
    },
    {
        path: "/signup",
        element: <Signup />
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
);