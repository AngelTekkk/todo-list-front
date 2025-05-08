import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:8080/todo-list-api';

const getCsrfToken = () => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match?.[1];
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const csrfToken = getCsrfToken();
            if (csrfToken) {
                headers.set('X-XSRF-TOKEN', csrfToken); // 💉 CSRF токен
            } else {
                console.warn("CSRF token not found in cookies!");
            }
            return headers;
        },
    }),
    tagTypes: ['Projects', 'Todos', 'LearningPlans'],
    endpoints: (builder) => ({
        getCsrfToken: builder.query({
            query: () => ({
                url: '/csrf',
                method: 'GET',
            }),
        }),
    }),
});