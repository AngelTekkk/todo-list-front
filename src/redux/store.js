// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer      from "../redux/auth/authSlice.js";
import dashboardReducer from "../redux/dashboard/dashboardSlice.js";
import todoReducer      from "../redux/todos/todoSlice.js";

// единый RTK Query slice, в который вы инжектите и authApi, и projectApi
import { apiSlice }     from "../services/api/apiSlice.js";
import {projectApi} from "../services/api/projectApi.js";

export const store = configureStore({
    reducer: {
        auth:      authReducer,
        dashboard: dashboardReducer,
        todos:     todoReducer,

        // регистрируем здесь API-slice только один раз
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            // …и здесь подключаем его middleware тоже только один раз
            .concat(apiSlice.middleware),
});






