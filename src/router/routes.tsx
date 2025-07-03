import { Navigate } from "react-router-dom";

import { Layout } from "@/components/layout";
import { Login, Register } from "@/pages/auth";
import { DetailledFurniture, Furnitures } from "@/pages/furnitures";
import { Dashboard } from "@/pages/home";
import { DetailledRessource, Ressources } from "@/pages/ressources";
import { Suppliers } from "@/pages/suppliers";

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
                path: "/ressources/:id",
                element: <DetailledRessource />,
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
