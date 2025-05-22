import {apiSlice} from './apiSlice.js';

export const curriculumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurriculumForCurrentUser: builder.query({
            query: () => ({
                url: '/curriculum/current',
                method: 'GET'
            }),
            providesTags: ['Curriculum'],
        }),
        createCurriculum: builder.mutation({
            query: (newCurriculum) => ({
                url: '/curriculum',
                method: 'POST',
                body: newCurriculum
            }),
            invalidatesTags: ['Curriculum'],
        }),
        deleteCurriculum: builder.mutation({
            query: () => ({
                url: '/curriculum/current',
                method: 'DELETE'
            }),
            invalidatesTags: ['Curriculum'],
        })
    })
});

export const {
    useGetCurriculumForCurrentUserQuery,
    useCreateCurriculumMutation,
    useDeleteCurriculumMutation

} = curriculumApi;