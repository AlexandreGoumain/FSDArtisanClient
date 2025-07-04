import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "@/store/api/baseApi";

import type {
    Ressource,
    RessourceCreate,
    RessourceDelete,
    RessourceUpdate,
} from "@/store/api/types";

export const ressourcesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRessources: builder.query<Ressource[], void>({
            query: () => ({
                url: API_ENDPOINTS.RESSOURCES,
                method: "GET",
            }),
            transformResponse: (response: { data: Ressource[] }) =>
                response.data,
            providesTags: ["Ressource", "Furniture"],
        }),

        getRessourceById: builder.query<Ressource, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Ressource }) => response.data,
            providesTags: ["Ressource", "Furniture"],
        }),

        createRessource: builder.mutation<Ressource, RessourceCreate>({
            query: (ressource) => ({
                url: API_ENDPOINTS.RESSOURCES,
                method: "POST",
                body: ressource,
            }),
            invalidatesTags: ["Ressource", "Furniture"],
        }),

        updateRessource: builder.mutation<Ressource, RessourceUpdate>({
            query: (ressource) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${ressource._id}`,
                method: "PUT",
                body: ressource,
            }),
            invalidatesTags: ["Ressource", "Furniture"],
        }),
        deleteRessource: builder.mutation<RessourceDelete, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.RESSOURCES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Ressource", "Furniture"],
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
