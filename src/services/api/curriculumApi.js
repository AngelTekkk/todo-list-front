import { apiSlice } from './apiSlice.js';

export const curriculumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurriculumForCurrentUser: builder.query({
            query: () => ({
                url: '/curriculum/current',
                method: 'GET'
            })
        })
    })
})

export const {
    useGetCurriculumForCurrentUserQuery

} = curriculumApi;