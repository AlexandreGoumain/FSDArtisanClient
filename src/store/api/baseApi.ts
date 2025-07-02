import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: [
        "User",
        "Auth",
        "Furniture",
        "Ressource",
        "Supplier",
        "FurnitureCategory",
        "RessourceCategory",
    ], // Tags pour toutes les features
    endpoints: () => ({}), // Vide - sera étendue
});

// Helper pour gérer les erreurs de manière consistante
export const handleApiError = (
    error: unknown,
    defaultMessage: string
): string => {
    if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as { message?: string };
        return errorData?.message || defaultMessage;
    }
    return defaultMessage;
};
