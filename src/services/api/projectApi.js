// src/api/projectApi.js
import { apiSlice } from "./apiSlice";

// Подключаем наши проекты к RTK Query
export const projectApi = apiSlice.injectEndpoints({
    // добавляем новые тэги к существующим
    tagTypes: ["Projects"],
    endpoints: (builder) => ({
        // 1) GET /projects
        getProjects: builder.query({
            query: () => ({
                url: "/projects",
                method: "GET",
            }),
            // из ответа берём поле .projects
            transformResponse: (response) => response.projects,
            providesTags: (projects = []) => [
                { type: "Projects", id: "LIST" },
                ...projects.map(({ id }) => ({ type: "Projects", id })),
            ],
        }),

        // 2) GET /projects/:id
        getProjectById: builder.query({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.project,
            providesTags: (project) =>
                project ? [{ type: "Projects", id: project.id }] : [],
        }),

        // 3) POST /projects
        createProject: builder.mutation({
            query: (payload) => ({
                url: "/projects",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.project,
            invalidatesTags: [{ type: "Projects", id: "LIST" }],
        }),

        // 4) PATCH /projects/:id
        updateProject: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: patch,
            }),
            transformResponse: (response) => response.project,
            invalidatesTags: (result, error, { id }) => [
                { type: "Projects", id },
            ],
        }),

        // 5) DELETE /projects/:id
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Projects", id },
                { type: "Projects", id: "LIST" },
            ],
        }),

        // 6) POST /projects/{projectId}/invite/{userId}
        inviteUser: builder.mutation({
            query: ({ projectId, userId }) => ({
                url: `/projects/${projectId}/invite/${userId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Projects", id: "LIST" }],
        }),
    }),
});

// Хуки, которые потом можно использовать в компонентах:
export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useInviteUserMutation,
} = projectApi;
