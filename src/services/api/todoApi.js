// src/services/api/todoApi.js
import { apiSlice } from './apiSlice.js';

export const todoApi = apiSlice.injectEndpoints({
    tagTypes: ['Todos', 'Projects'],
    endpoints: (builder) => ({
        // — GET /todos
        getTodos: builder.query({
            query: () => ({
                url: '/todos',
                method: 'GET',
            }),
            providesTags: (todos = []) => [
                { type: 'Todos', id: 'LIST' },
                ...todos.map((t) => ({ type: 'Todos', id: t.id })),
            ],
        }),

        // — GET /todos/:id
        getTodo: builder.query({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'GET',
            }),
            providesTags: (todo) =>
                todo ? [{ type: 'Todos', id: todo.id }] : [],
        }),

        // — POST /todos
        createTodo: builder.mutation({
            query: (newTodo) => ({
                url: '/todos',
                method: 'POST',
                body: newTodo,
            }),
            invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
        }),

        // — PATCH /todos/:id
        // теперь принимает { id, ...patch } и body = patch
        updateTodo: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/todos/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Todos', id },
                { type: 'Todos', id: 'LIST' },
            ],
        }),

        // — DELETE /todos/:id
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Todos', id },
                { type: 'Todos', id: 'LIST' },
            ],
        }),

        // — (опционально) PATCH /todos/:todoId/assign/project/:projectId
        // если вы хотите отдельный эндпоинт для назначений
        assignToProject: builder.mutation({
            query: ({ todoId, projectId }) => ({
                url: `/todos/${todoId}`,
                method: 'PATCH',
                body: { projectId },
            }),
            invalidatesTags: (res, err, { todoId, projectId }) => [
                { type: 'Todos', id: todoId },
                { type: 'Todos', id: 'LIST' },
                { type: 'Projects', id: projectId },
                { type: 'Projects', id: 'LIST' },
            ],
        }),

        // — PATCH /todos/:id/status
        updateStatusTodo: builder.mutation({
            query: ({ newStatusObject, id }) => ({
                url: `/todos/${id}/status`,
                method: 'PATCH',
                body: newStatusObject,
            }),
            invalidatesTags: (res, err, { id }) => [
                { type: 'Todos', id },
                { type: 'Todos', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetTodosQuery,
    useGetTodoQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAssignToProjectMutation,
    useUpdateStatusTodoMutation,
} = todoApi;
