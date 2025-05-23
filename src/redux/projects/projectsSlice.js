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

