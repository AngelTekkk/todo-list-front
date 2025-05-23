import { apiSlice } from './apiSlice.js';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        checkAuth: builder.query({
            query: () => ({
                url: '/auth/current',
                method: 'GET',
            }),
        }),
        getUsers: builder.query({
            query: () => ({ url: "/users", method: "GET" }),
            transformResponse: (response) => response.users,
            providesTags: (users = []) => [
                { type: "Users", id: "LIST" },
                ...users.map((u) => ({ type: "Users", id: u.id })),
            ],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useCheckAuthQuery, useGetUsersQuery } = authApi;
