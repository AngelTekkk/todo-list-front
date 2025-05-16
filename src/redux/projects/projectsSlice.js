// // src/redux/projects/projectsSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import { projectApi } from "../../services/api/projectApi";
//
// const initialState = {
//     items: [],
//     status: "idle",    // "idle" | "loading" | "succeeded" | "failed"
//     error: null,
//     message: "",
// };
//
// const projectsSlice = createSlice({
//     name: "projects",
//     initialState,
//     reducers: {
//         // (при желании можно добавить sync-action’ы)
//         allProjects: (state, action) => {
//             state.projects = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         // GET /projects
//         builder
//             .addMatcher(
//                 projectApi.endpoints.getProjects.matchPending,
//                 (state) => {
//                     state.status = "loading";
//                     state.error  = null;
//                 }
//             )
//             .addMatcher(
//                 projectApi.endpoints.getProjects.matchFulfilled,
//                 (state, { payload, meta }) => {
//                     state.status  = "succeeded";
//                     state.items   = payload;            // payload — массив проектов
//                     state.message = meta.response?.data?.message ?? "";
//                 }
//             )
//             .addMatcher(
//                 projectApi.endpoints.getProjects.matchRejected,
//                 (state, { error }) => {
//                     state.status = "failed";
//                     state.error  = error.message;
//                 }
//             );
//
//         // POST /projects
//         builder.addMatcher(
//             projectApi.endpoints.createProject.matchFulfilled,
//             (state, { payload }) => {
//                 state.items.push(payload);        // payload — только что созданный проект
//             }
//         );
//
//         // PATCH /projects/:id
//         builder.addMatcher(
//             projectApi.endpoints.updateProject.matchFulfilled,
//             (state, { payload }) => {
//                 const idx = state.items.findIndex((p) => p.id === payload.id);
//                 if (idx !== -1) state.items[idx] = payload;
//             }
//         );
//
//         // DELETE /projects/:id
//         builder.addMatcher(
//             projectApi.endpoints.deleteProject.matchFulfilled,
//             (state, { meta }) => {
//                 const deletedId = meta.arg.originalArgs;
//                 state.items = state.items.filter((p) => p.id !== deletedId);
//             }
//         );
//     },
// });
//
// export const {allProjects} = projectsSlice.actions;
//
// export default projectsSlice.reducer;

// src/redux/projects/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projects: [],
    status: 'idle',
    error: null,
};

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        allProjects: (state, action) => {
            state.projects = action.payload;
        },
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(project => project.id !== action.payload);
        },
        updateProject: (state, action) => {
            const updated = action.payload;
            state.projects = state.projects.map(project =>
                project.id === updated.id ? updated : project
            );
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    allProjects,
    addProject,
    removeProject,
    updateProject,
    setProjects,
    setStatus,
    setError
} = projectSlice.actions;

export const getAllProjects = (state) => state.projects.projects;

export default projectSlice.reducer;

