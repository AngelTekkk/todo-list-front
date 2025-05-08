import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectsAPI from "../../api/projects";

// Alle Projekte herunterladen
export const loadProjects = createAsyncThunk("projects/loadAll", async () => {
    const response = await projectsAPI.fetchProjects();
    return {
        projects: response.data.projects,
        message: response.data.message,
    };
});

// Ein neues Projekt erstellen
export const createProject = createAsyncThunk(
    "projects/create",
    async (projectData) => {
        const response = await projectsAPI.createProject(projectData);
        return response.data;
    }
);

// Aktualisierung eines Projekts nach ID
export const updateProject = createAsyncThunk(
    "projects/update",
    async ({ id, projectData }) => {
        const response = await projectsAPI.updateProject(id, projectData);
        return response.data;
    }
);

// Löschen eines Projekts nach ID
export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
    await projectsAPI.deleteProject(id);
    return id;
});

const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        items: [],
        status: "idle",
        error: null,
        message: "", // <-- добавил сюда
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadProjects.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loadProjects.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.projects; // массив
                state.message = action.payload.message; // строка
            })
            .addCase(loadProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Projekt erstellen
            .addCase(createProject.fulfilled, (state, { payload }) => {
                state.items.push(payload);
            })

            // Projekt aktualisieren
            .addCase(updateProject.fulfilled, (state, action) => {
                const idx = state.items.findIndex((p) => p.id === action.payload.id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                }
            })

            // Project löschen
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
            });
    },
});

export default projectsSlice.reducer;