import {apiSlice} from './apiSlice.js';

export const curriculumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurriculumForCurrentUser: builder.query({
            query: () => ({
                url: '/curriculum/current',
                method: 'GET'
            }),
        }),
        createCurriculum: builder.mutation({
            query: (newCurriculum) => ({
                url: '/curriculum',
                method: 'POST',
                body: newCurriculum
            }),
        }),
        deleteCurriculum: builder.mutation({
            query: () => ({
                url: '/curriculum/current',
                method: 'DELETE'
            }),
        }),
        removeTodoFromCurry: builder.mutation({
            query: (toDoId) => ({
                url: `/curriculum/current/remove-todo/${toDoId}`,
                method: 'DELETE'
            })
        }),
        addTodoToCurry: builder.mutation({
            query: ({toDoId, curryId}) => ({
                url: `/todos/${toDoId}`,
                method: 'PATCH',
                body: { curriculumIds: [curryId] }
            })
        })
    })
});

export const {
    useGetCurriculumForCurrentUserQuery,
    useCreateCurriculumMutation,
    useDeleteCurriculumMutation,
    useRemoveTodoFromCurryMutation,
    useAddTodoToCurryMutation
} = curriculumApi;