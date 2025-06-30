import { useRoutes } from "react-router-dom";
import { useAuth } from "./context/auth";
import { privateRoutes, publicRoutes } from "./router/routes";

export const RoutesApp = () => {
    const { state: authState } = useAuth();

    return useRoutes(authState.isAuthenticated ? privateRoutes : publicRoutes);
    // return useRoutes(privateRoutes);
};
