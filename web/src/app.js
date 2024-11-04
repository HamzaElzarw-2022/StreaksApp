import React, { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, Routes, Navigate, Route, BrowserRouter, RouterProvider } from "react-router-dom";


import Login from './views/login';
import Signup from './views/signup';
import HomePage from './views/homePage';
import { userContext, UserProvider } from './contexts/userContext';

export default function App() {

    const {user} = useContext(userContext);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navigate to="/login" />
        },
        {
            path: "/homepage",
            element: <HomePage />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/login",
            element: <Login />
        }
    ])

    

    return(
        <UserProvider>
                <RouterProvider router={router} />
        </UserProvider>
        
    )
}