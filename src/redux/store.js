import { configureStore } from '@reduxjs/toolkit'
import projectsReducer  from "../redux/projects/projectsSlice";

export const store = configureStore({
    reducer: {
        projects: projectsReducer
    },
})




