import { apiSlice } from './apiSlice.js';

export const todoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => ({
                url: '/todos',
                method: 'GET'
            })
        }),
        // getTodo: builder.query({
        //     query: (id) => ({
        //         url: `/todos/${id}`,
        //         method: 'GET'
        //     })
        // }),
        createTodo: builder.mutation({
            query: (newTodo) => ({
                url: '/todos',
                method: 'POST',
                body: newTodo
            })
        }),
        updateTodo: builder.mutation({
            query: ({id, updatedTodo}) => ({
                url: `/todos/${id}`,
                method: 'PATCH',
                body: updatedTodo
            })
        }),
        deleteTodo: builder.mutation({
            query: ( id) => ({
                url: `/todos/${id}`,
                method: 'DELETE'
            })
        }),
        assignToProject: builder.mutation({
            query: ({todoId, projectId}) => ({
                url: `/todos/${todoId}/assign/project/${projectId}`,
                method: 'PATCH'
            })
        }),
        updateStatusTodo: builder.mutation({
            query: ({newStatusObject, id}) => ({
                url: `/todos/${id}/status`,
                method: 'PATCH',
                body: newStatusObject
            })
        }),

    })
})

export const {
    useGetTodosQuery,
    useGetTodoQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAssignToProjectMutation,
    useUpdateStatusTodoMutation
} = todoApi;