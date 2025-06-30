import { Navigate } from "react-router-dom";

import { Layout } from "@/components/layout/layout";
import { LoginForm } from "@/pages/auth/login";
import { RegisterForm } from "@/pages/auth/register";
import { FakePage } from "@/pages/fakePage";

export const privateRoutes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <FakePage title="Dashboard" />,
            },
            {
                path: "/furnitures",
                element: <FakePage title="Meubles" />,
            },
            {
                path: "/furnitures/create",
                element: <FakePage title="Créer Meuble" />,
            },
            {
                path: "/furnitures/:id",
                element: <FakePage title="Détail Meuble" />,
            },
            {
                path: "/furnitures/edit/:id",
                element: <FakePage title="Modifier Meuble" />,
            },
            {
                path: "/materials",
                element: <FakePage title="Matériaux" />,
            },
            {
                path: "/materials/create",
                element: <FakePage title="Créer Matériau" />,
            },
            {
                path: "/materials/:id",
                element: <FakePage title="Détail Matériau" />,
            },
            {
                path: "/suppliers",
                element: <FakePage title="Fournisseurs" />,
            },
            {
                path: "/suppliers/create",
                element: <FakePage title="Créer Fournisseur" />,
            },
            {
                path: "/categories",
                element: <FakePage title="Catégories" />,
            },
            {
                path: "/categories/create",
                element: <FakePage title="Créer Catégorie" />,
            },
        ],
    },
];

export const publicRoutes = [
    {
        path: "/login",
        element: <LoginForm />,
    },
    {
        path: "/register",
        element: <RegisterForm />,
    },
    { path: "*", element: <Navigate to="/login" replace /> },
];
