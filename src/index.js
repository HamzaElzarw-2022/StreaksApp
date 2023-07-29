import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from './views/login';
import HomePage from './views/homePage';

import "bootstrap/dist/css/bootstrap.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/Login",
        element: <Login />
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
);