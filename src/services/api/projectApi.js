import { apiSlice } from "./apiSlice";

export const projectApi = apiSlice.injectEndpoints({
    tagTypes: ["Projects"],
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => ({ url: "/projects", method: "GET" }),
            transformResponse: (response) => response.projects,
            providesTags: (projects = []) => [
                { type: "Projects", id: "LIST" },
                ...projects.map(({ id }) => ({ type: "Projects", id })),
            ],
        }),
        getProjectById: builder.query({
            query: (id) => ({ url: `/projects/${id}`, method: "GET" }),
            transformResponse: (response) => response.project,
            providesTags: (project) =>
                project ? [{ type: "Projects", id: project.id }] : [],
        }),
        createProject: builder.mutation({
            query: (payload) => ({
                url: "/projects",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.project,
            invalidatesTags: [{ type: "Projects", id: "LIST" }],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: patch,
            }),
            transformResponse: (response) => response.project,
            invalidatesTags: (result, error, { id }) => [
                { type: "Projects", id },       // обновить детальный кэш
                { type: "Projects", id: "LIST" } // и общий список
            ],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
            invalidatesTags: (result, error, id) => [
                { type: "Projects", id },
                { type: "Projects", id: "LIST" },
            ],
        }),
        inviteUser: builder.mutation({
            query: ({ projectId, userId }) => ({
                url: `/projects/${projectId}/invite/${userId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Projects", id: "LIST" }],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useInviteUserMutation,
} = projectApi;

