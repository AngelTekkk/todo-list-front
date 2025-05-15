// src/redux/projects/projectsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { projectApi } from "../../services/api/projectApi";

const initialState = {
    items: [],
    status: "idle",    // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    message: "",
};

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        // (при желании можно добавить sync-action’ы)
    },
    extraReducers: (builder) => {
        // GET /projects
        builder
            .addMatcher(
                projectApi.endpoints.getProjects.matchPending,
                (state) => {
                    state.status = "loading";
                    state.error  = null;
                }
            )
            .addMatcher(
                projectApi.endpoints.getProjects.matchFulfilled,
                (state, { payload, meta }) => {
                    state.status  = "succeeded";
                    state.items   = payload;            // payload — массив проектов
                    state.message = meta.response?.data?.message ?? "";
                }
            )
            .addMatcher(
                projectApi.endpoints.getProjects.matchRejected,
                (state, { error }) => {
                    state.status = "failed";
                    state.error  = error.message;
                }
            );

        // POST /projects
        builder.addMatcher(
            projectApi.endpoints.createProject.matchFulfilled,
            (state, { payload }) => {
                state.items.push(payload);        // payload — только что созданный проект
            }
        );

        // PATCH /projects/:id
        builder.addMatcher(
            projectApi.endpoints.updateProject.matchFulfilled,
            (state, { payload }) => {
                const idx = state.items.findIndex((p) => p.id === payload.id);
                if (idx !== -1) state.items[idx] = payload;
            }
        );

        // DELETE /projects/:id
        builder.addMatcher(
            projectApi.endpoints.deleteProject.matchFulfilled,
            (state, { meta }) => {
                const deletedId = meta.arg.originalArgs;
                state.items = state.items.filter((p) => p.id !== deletedId);
            }
        );
    },
});

export default projectsSlice.reducer;
