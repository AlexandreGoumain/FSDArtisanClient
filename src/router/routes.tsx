import { Navigate } from "react-router-dom";

import { Layout } from "@/components/layout/layout";
import { Login } from "@/pages/auth/login";
import { Register } from "@/pages/auth/register";
import { DetailledFurniture } from "@/pages/furnitures/detailledFurniture";
import { Furnitures } from "@/pages/furnitures/furnitures";
import { Dashboard } from "@/pages/home/dashboard";
import { Ressources } from "@/pages/ressources/ressources";
import { Suppliers } from "@/pages/suppliers/suppliers";

export const privateRoutes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/furnitures",
                element: <Furnitures />,
            },
            {
                path: "/furnitures/:id",
                element: <DetailledFurniture />,
            },
            {
                path: "/suppliers",
                element: <Suppliers />,
            },
            {
                path: "/ressources",
                element: <Ressources />,
            },
        ],
    },
];

export const publicRoutes = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },

    { path: "*", element: <Navigate to="/login" replace /> },
];
