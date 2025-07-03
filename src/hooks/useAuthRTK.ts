import { useEffect } from "react";

import { handleApiError } from "@/store/api/baseApi";

import type { LoginCredentials, RegisterData } from "@/types/auth";

import {
    useLazyGetMeUserQuery,
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
} from "@/store/api";

import { persistor } from "@/store/store";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    forceLogout,
    selectCurrentUser,
    selectIsAuthenticated,
    selectIsAuthInitialized,
} from "@/store/slices/authSlice";

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

    const [getCurrentUser] = useLazyGetMeUserQuery();

    const dispatch = useAppDispatch();

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
            // Déconnexion côté serveur
            await logoutMutation().unwrap();
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        } finally {
            // Forcer la déconnexion locale même si le serveur a échoué
            dispatch(forceLogout());

            // Nettoyer complètement l'état persisté
            await persistor.purge();
        }
    };

    const clearPersistedAuth = async () => {
        // Utilitaire pour nettoyer uniquement l'auth persistée
        dispatch(forceLogout());
        await persistor.purge();
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
        clearPersistedAuth,

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
