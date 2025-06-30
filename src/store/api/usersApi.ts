import { type IAuthUser } from "../../types/auth";
import { baseApi } from "./baseApi";

// Types spécifiques aux utilisateurs
export interface UserFilters {
    role?: string;
    status?: "active" | "inactive";
    search?: string;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserById: builder.query<{ user: IAuthUser }, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        updateUser: builder.mutation<
            { user: IAuthUser },
            {
                id: string;
                data: UpdateUserData;
            }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id },
                "User",
            ],
        }),

        deleteUser: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;
