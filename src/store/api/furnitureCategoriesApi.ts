import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "./baseApi";
import type {
    FurnitureCategory,
    FurnitureCategoryCreate,
    FurnitureCategoryDelete,
    FurnitureCategoryUpdate,
} from "./types/furnitureCategoriesTypes";

export const furnitureCategoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllFurnitureCategories: builder.query<FurnitureCategory[], void>({
            query: () => ({
                url: API_ENDPOINTS.FURNITURE_CATEGORIES,
                method: "GET",
            }),
            transformResponse: (response: { data: FurnitureCategory[] }) =>
                response.data,
            providesTags: ["FurnitureCategory"],
        }),

        getFurnitureCategoryById: builder.query<FurnitureCategory, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.FURNITURE_CATEGORIES}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: FurnitureCategory }) =>
                response.data,
            providesTags: ["FurnitureCategory"],
        }),

        createFurnitureCategory: builder.mutation<
            FurnitureCategory,
            FurnitureCategoryCreate
        >({
            query: (furniture) => ({
                url: API_ENDPOINTS.FURNITURE_CATEGORIES,
                method: "POST",
                body: furniture,
            }),
            invalidatesTags: ["Furniture"],
        }),

        updateFurnitureCategory: builder.mutation<
            FurnitureCategory,
            FurnitureCategoryUpdate
        >({
            query: (furniture) => ({
                url: `${API_ENDPOINTS.FURNITURE_CATEGORIES}/${furniture._id}`,
                method: "PUT",
                body: furniture,
            }),
            invalidatesTags: ["Furniture"],
        }),
        deleteFurnitureCategory: builder.mutation<
            FurnitureCategoryDelete,
            string
        >({
            query: (id) => ({
                url: `${API_ENDPOINTS.FURNITURE_CATEGORIES}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Furniture"],
        }),
    }),
});

export const {
    useGetAllFurnitureCategoriesQuery,
    useGetFurnitureCategoryByIdQuery,
    useCreateFurnitureCategoryMutation,
    useUpdateFurnitureCategoryMutation,
    useDeleteFurnitureCategoryMutation,
} = furnitureCategoriesApi;
