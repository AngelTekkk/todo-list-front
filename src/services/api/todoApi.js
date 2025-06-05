import { apiSlice } from './apiSlice.js';

export const todoApi = apiSlice.injectEndpoints({
    tagTypes: ['Todos', 'Projects'],
    endpoints: (builder) => ({
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

        createTodo: builder.mutation({
            query: (newTodo) => ({
                url: '/todos',
                method: 'POST',
                body: newTodo,
            }),
            invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
        }),

        updateTodo: builder.mutation({
            query: ({ id, updatedTodo }) => ({
                url: `/todos/${id}`,
                method: 'PATCH',
                body: updatedTodo,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Todos', id },
                { type: 'Todos', id: 'LIST' },
            ],
        }),

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

        assignToProject: builder.mutation({
            query: ({ todoId, projectId }) => ({
                url: `/todos/${todoId}/assign/project/${projectId}`,
                method: 'PATCH',
            }),
            invalidatesTags: (res, err, { todoId, projectId }) => [
                { type: 'Todos', id: todoId },
                { type: 'Todos', id: 'LIST' },
                { type: 'Projects', id: projectId },
                { type: 'Projects', id: 'LIST' },
            ],
        }),

        removeFromProject: builder.mutation({
            query: ({ todoId, projectId }) => ({
                url: `/todos/${todoId}/assign/project/${projectId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (res, err, { todoId, projectId }) => [
                { type: 'Todos', id: todoId },
                { type: 'Todos', id: 'LIST' },
                { type: 'Projects', id: projectId },
                { type: 'Projects', id: 'LIST' },
            ],
        }),

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
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAssignToProjectMutation,
    useRemoveFromProjectMutation,
    useUpdateStatusTodoMutation,
} = todoApi;
