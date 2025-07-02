// import {
//     type AuthResponse,
//     type LoginCredentials,
//     type RegisterData,
// } from "../../types/auth";
import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "./baseApi";

import type {
    RessourceCategory,
    RessourceCategoryCreate,
    RessourceCategoryDelete,
    RessourceCategoryUpdate,
} from "./types/ressourcesCategoriesTypes";

export const ressourcesCategoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRessourcesCategories: builder.query<RessourceCategory[], void>({
            query: () => ({
                url: API_ENDPOINTS.RESOURCE_CATEGORIES,
                method: "GET",
            }),
            transformResponse: (response: { data: RessourceCategory[] }) =>
                response.data,
            providesTags: ["RessourceCategory"],
        }),

        getRessourceCategoryById: builder.query<RessourceCategory, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESOURCE_CATEGORIES}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: RessourceCategory }) =>
                response.data,
            providesTags: ["RessourceCategory"],
        }),

        createRessourceCategory: builder.mutation<
            RessourceCategory,
            RessourceCategoryCreate
        >({
            query: (ressourceCategory) => ({
                url: API_ENDPOINTS.RESOURCE_CATEGORIES,
                method: "POST",
                body: ressourceCategory,
            }),
            invalidatesTags: ["RessourceCategory"],
        }),

        updateRessourceCategory: builder.mutation<
            RessourceCategory,
            RessourceCategoryUpdate
        >({
            query: (ressourceCategory) => ({
                url: `${API_ENDPOINTS.RESOURCE_CATEGORIES}/${ressourceCategory._id}`,
                method: "PUT",
                body: ressourceCategory,
            }),
            invalidatesTags: ["RessourceCategory"],
        }),
        deleteRessourceCategory: builder.mutation<
            RessourceCategoryDelete,
            string
        >({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESOURCE_CATEGORIES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RessourceCategory"],
        }),
    }),
});

export const {
    useGetAllRessourcesCategoriesQuery,
    useGetRessourceCategoryByIdQuery,
    useCreateRessourceCategoryMutation,
    useUpdateRessourceCategoryMutation,
    useDeleteRessourceCategoryMutation,
} = ressourcesCategoriesApi;
