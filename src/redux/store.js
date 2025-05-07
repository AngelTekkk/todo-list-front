import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '../redux/dashboard/dashboardSlice.js'
import { authApi } from '../services/api/authApi.js';

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})