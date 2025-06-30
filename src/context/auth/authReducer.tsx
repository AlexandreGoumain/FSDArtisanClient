import { type IActionAuth, type IStateAuth } from "./authTypes";

// Fonction utilitaire pour récupérer les données d'auth depuis localStorage
const getAuthFromStorage = () => {
    try {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData) : {};
    } catch (error: unknown) {
        console.warn("Erreur lecture auth:", error);
        // Nettoyer les données corrompues
        localStorage.removeItem("auth");
        return {};
    }
};

const authInfoLocalStorage = getAuthFromStorage();

export const initialState: IStateAuth = {
    isAuthenticated: Object.keys(authInfoLocalStorage).length > 0,
    authInfo:
        Object.keys(authInfoLocalStorage).length !== 0
            ? authInfoLocalStorage
            : undefined,
};

export const reducer = (state: IStateAuth, action: IActionAuth): IStateAuth => {
    switch (action.type) {
        case "login":
        case "auth-check":
            try {
                localStorage.setItem("auth", JSON.stringify(action.payload));
            } catch (error: unknown) {
                console.warn("Erreur sauvegarde auth:", error);
            }
            return {
                isAuthenticated: !!action.payload,
                authInfo: action.payload,
            };
        case "logout":
            localStorage.removeItem("auth");
            return {
                isAuthenticated: false,
                authInfo: undefined,
            };
        default:
            return state;
    }
};
