import {
    type AuthResponse,
    type LoginCredentials,
    type RegisterData,
} from "../../types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User", "Auth"],
        }),

        register: builder.mutation<AuthResponse, RegisterData>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User", "Auth"],
        }),

        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User", "Auth"],
        }),

        // 👤 Get current user (vérif l'auth)
        getCurrentUser: builder.query<AuthResponse, void>({
            query: () => "/auth/me",
            providesTags: ["User"],
            // Gestion des erreurs d'auth
            transformErrorResponse: (response) => {
                if (response.status === 401) {
                    return { data: null, status: 401 };
                }
                return response;
            },
        }),

        // 🔄 Refresh token (si votre backend le supporte)
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),
            invalidatesTags: ["User", "Auth"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useRefreshTokenMutation,
    useLazyGetCurrentUserQuery,
} = authApi;
