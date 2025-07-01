// import {
//     type AuthResponse,
//     type LoginCredentials,
//     type RegisterData,
// } from "../../types/auth";
import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "./baseApi";
import type {
    Ressource,
    RessourceCreate,
    RessourceDelete,
    RessourceUpdate,
} from "./types/ressourcesType";

export const ressourcesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRessources: builder.query<Ressource[], void>({
            query: () => ({
                url: API_ENDPOINTS.RESSOURCES,
                method: "GET",
            }),
            transformResponse: (response: { data: Ressource[] }) =>
                response.data,
            providesTags: ["Ressource"],
        }),

        getRessourceById: builder.query<Ressource, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Ressource }) => response.data,
            providesTags: ["Ressource"],
        }),

        createRessource: builder.mutation<Ressource, RessourceCreate>({
            query: (ressource) => ({
                url: API_ENDPOINTS.RESSOURCES,
                method: "POST",
                body: ressource,
            }),
            invalidatesTags: ["Ressource"],
        }),

        updateRessource: builder.mutation<Ressource, RessourceUpdate>({
            query: (ressource) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${ressource._id}`,
                method: "PUT",
                body: ressource,
            }),
            invalidatesTags: ["Ressource"],
        }),
        deleteRessource: builder.mutation<RessourceDelete, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Ressource"],
        }),
    }),
});

export const {
    useGetAllRessourcesQuery,
    useGetRessourceByIdQuery,
    useLazyGetRessourceByIdQuery,
    useCreateRessourceMutation,
    useUpdateRessourceMutation,
    useDeleteRessourceMutation,
} = ressourcesApi;
