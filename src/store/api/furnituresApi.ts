// import {
//     type AuthResponse,
//     type LoginCredentials,
//     type RegisterData,
// } from "../../types/auth";
import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "./baseApi";
import type {
    Furniture,
    FurnitureCreate,
    FurnitureDelete,
    FurnitureUpdate,
} from "./types/furnituresTypes";

export const furnituresApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllFurnitures: builder.query<Furniture[], void>({
            query: () => ({
                url: API_ENDPOINTS.FURNITURES,
                method: "GET",
            }),
            transformResponse: (response: { data: Furniture[] }) =>
                response.data,
            providesTags: ["Furniture"],
        }),

        getFurnitureById: builder.query<Furniture, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.FURNITURES}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Furniture }) => response.data,
            providesTags: ["Furniture"],
        }),

        createFurniture: builder.mutation<Furniture, FurnitureCreate>({
            query: (furniture) => ({
                url: API_ENDPOINTS.FURNITURES,
                method: "POST",
                body: furniture,
            }),
            invalidatesTags: ["Furniture"],
        }),

        updateFurniture: builder.mutation<Furniture, FurnitureUpdate>({
            query: (furniture) => ({
                url: `${API_ENDPOINTS.FURNITURES}/${furniture._id}`,
                method: "PUT",
                body: furniture,
            }),
            invalidatesTags: ["Furniture"],
        }),
        deleteFurniture: builder.mutation<FurnitureDelete, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.FURNITURES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Furniture"],
        }),
    }),
});

export const {
    useGetAllFurnituresQuery,
    useGetFurnitureByIdQuery,
    useLazyGetFurnitureByIdQuery,
    useCreateFurnitureMutation,
    useUpdateFurnitureMutation,
    useDeleteFurnitureMutation,
} = furnituresApi;
