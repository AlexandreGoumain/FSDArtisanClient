// import {
//     type AuthResponse,
//     type LoginCredentials,
//     type RegisterData,
// } from "../../types/auth";
import { API_ENDPOINTS } from "@/services/constants";
import { baseApi } from "./baseApi";
import type {
    Supplier,
    SupplierCreate,
    SupplierDelete,
    SupplierUpdate,
} from "./types/suppliersType";

export const suppliersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSuppliers: builder.query<Supplier[], void>({
            query: () => ({
                url: API_ENDPOINTS.SUPPLIERS,
                method: "GET",
            }),
            transformResponse: (response: { data: Supplier[] }) =>
                response.data,
            providesTags: ["Supplier"],
        }),

        getSupplierById: builder.query<Supplier, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.SUPPLIERS}/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Supplier }) => response.data,
            providesTags: ["Supplier"],
        }),

        createSupplier: builder.mutation<Supplier, SupplierCreate>({
            query: (supplier) => ({
                url: API_ENDPOINTS.SUPPLIERS,
                method: "POST",
                body: supplier,
            }),
            invalidatesTags: ["Supplier"],
        }),

        updateSupplier: builder.mutation<Supplier, SupplierUpdate>({
            query: (supplier) => ({
                url: `${API_ENDPOINTS.SUPPLIERS}/${supplier._id}`,
                method: "PUT",
                body: supplier,
            }),
            invalidatesTags: ["Supplier"],
        }),
        deleteSupplier: builder.mutation<SupplierDelete, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.SUPPLIERS}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Supplier"],
        }),
    }),
});

export const {
    useGetAllSuppliersQuery,
    useGetSupplierByIdQuery,
    useLazyGetSupplierByIdQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
} = suppliersApi;
