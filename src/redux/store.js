import dashboardReducer from '../redux/dashboard/dashboardSlice.js'
import projectsReducer  from "../redux/projects/projectsSlice";
import todoReducer from "../redux/todos/todoSlice.js"
import { authApi } from '../services/api/authApi.js';

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        projects: projectsReducer,
        todos: todoReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})

