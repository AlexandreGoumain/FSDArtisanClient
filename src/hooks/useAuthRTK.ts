import { useEffect } from "react";
import {
    useLazyGetCurrentUserQuery,
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
} from "../store/api/authApi";
import { handleApiError } from "../store/api/baseApi";
import { useAppSelector } from "../store/hooks";
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectIsAuthInitialized,
} from "../store/slices/authSlice";
import { type LoginCredentials, type RegisterData } from "../types/auth";

export const useAuth = () => {
    // État depuis Redux
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsAuthInitialized);

    // Mutations RTK Query
    const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
    const [registerMutation, { isLoading: isRegisterLoading }] =
        useRegisterMutation();
    const [logoutMutation, { isLoading: isLogoutLoading }] =
        useLogoutMutation();

    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    const initializeAuth = async () => {
        if (!isInitialized) {
            await getCurrentUser();
        }
    };

    // 🔐 Login
    const login = async (credentials: LoginCredentials) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            return { success: true, user: result.user };
        } catch (error: unknown) {
            return {
                success: false,
                error: handleApiError(error, "Erreur de connexion"),
            };
        }
    };

    // 📝 Register
    const register = async (userData: RegisterData) => {
        try {
            const result = await registerMutation(userData).unwrap();
            return { success: true, user: result.user };
        } catch (error: unknown) {
            return {
                success: false,
                error: handleApiError(error, "Erreur d'inscription"),
            };
        }
    };

    // 🚪 Logout
    const logout = async () => {
        try {
            await logoutMutation().unwrap();
            return { success: true };
        } catch (error: unknown) {
            return {
                success: false,
                error: handleApiError(error, "Erreur de déconnexion"),
            };
        }
    };

    return {
        // État
        user,
        isAuthenticated,
        isInitialized,

        // Actions
        login,
        register,
        logout,
        initializeAuth,

        // Loading states
        isLoginLoading,
        isRegisterLoading,
        isLogoutLoading,
    };
};

// 🚀 Hook pour initialiser l'auth automatiquement
export const useAuthInitializer = () => {
    const { isInitialized, initializeAuth } = useAuth();

    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [isInitialized, initializeAuth]);

    return isInitialized;
};
