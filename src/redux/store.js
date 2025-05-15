import { configureStore } from "@reduxjs/toolkit";

import authReducer      from "../redux/auth/authSlice.js";
import dashboardReducer from "../redux/dashboard/dashboardSlice.js";
import todoReducer      from "../redux/todos/todoSlice.js";
import projectsReducer  from "./projects/projectsSlice.js";
import { authApi } from '../services/api/authApi.js';
//import {projectApi} from "../services/api/projectApi.js"; // Wozu ist dieses Import?

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        todos: todoReducer,
        projects:   projectsReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})
