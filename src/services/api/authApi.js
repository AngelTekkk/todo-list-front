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
        checkAuth: builder.query({
            query: () => ({
                url: '/auth/current',
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    user: response,
                    isAuthenticated: true
                };
            },
            transformErrorResponse: () => {
                return {
                    user: null,
                    isAuthenticated: false
                };
            }
        }),
        test: builder.query({
            query: () => ({
                url: '/todos',
                method: 'GET',
            }),
        }),
        testPost: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
        }),
    }),
});


export const { useLoginMutation, useRegisterMutation, useCheckAuthQuery, useTestQuery, useTestPostMutation } = authApi;