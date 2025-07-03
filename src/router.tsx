import { useRoutes } from "react-router-dom";

import { privateRoutes, publicRoutes } from "@/router/routes";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

export const RoutesApp = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return useRoutes(isAuthenticated ? privateRoutes : publicRoutes);
};
