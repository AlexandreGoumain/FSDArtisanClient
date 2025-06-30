import { useContext } from "react";
import { AuthContext } from "./authContext";
import type { IAuthPayload } from "./authTypes";

// Hook de base pour accéder au contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

// Fonctions utilitaires pour l'authentification
export const useAuthActions = () => {
    const { dispatch } = useAuth();

    const login = (authData: IAuthPayload) => {
        dispatch({ type: "login", payload: authData });
    };

    const logout = () => {
        dispatch({ type: "logout" });
    };

    return { login, logout };
};
