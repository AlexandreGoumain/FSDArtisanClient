import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IAuthUser } from "../../types/auth";
import { authApi } from "../api/authApi";

interface AuthState {
    user: IAuthUser | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
    extraReducers: (builder) => {
        // 🎯 Réaction aux actions RTK Query

        // Login réussi
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isInitialized = true;
            }
        );

        // Register réussi
        builder.addMatcher(
            authApi.endpoints.register.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isInitialized = true;
            }
        );

        // Logout réussi
        builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        });

        // getCurrentUser réussi
        builder.addMatcher(
            authApi.endpoints.getCurrentUser.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isInitialized = true;
            }
        );

        // getCurrentUser échoué (pas connecté)
        builder.addMatcher(
            authApi.endpoints.getCurrentUser.matchRejected,
            (state, action) => {
                // Si erreur 401, l'utilisateur n'est pas connecté
                if (action.payload?.status === 401) {
                    state.user = null;
                    state.isAuthenticated = false;
                }
                state.isInitialized = true;
            }
        );

        // Refresh token réussi
        builder.addMatcher(
            authApi.endpoints.refreshToken.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isInitialized = true;
            }
        );

        // Gestion des erreurs d'auth sur toutes les mutations
        builder.addMatcher(
            (action) =>
                action.type.endsWith("/rejected") &&
                action.payload?.status === 401,
            (state) => {
                // Auto-déconnexion si token expiré
                state.user = null;
                state.isAuthenticated = false;
                state.isInitialized = true;
            }
        );
    },
});

export const { resetAuth, setInitialized } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) =>
    state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: { auth: AuthState }) =>
    state.auth.isInitialized;
