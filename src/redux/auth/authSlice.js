import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        oauth: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    }
});

export const {logout, oauth} = authSlice.actions;

export const getIsAuthenticated = (state) => state.auth.isAuthenticated;
export const getUser = (state) => state.auth.user;

export default authSlice.reducer;