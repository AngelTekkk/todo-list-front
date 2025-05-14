import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true;
        },
        logout: (state) => {
            console.log("LOGOUT");
            state.isAuthenticated = false;
        },
        oauth: (state) => {
            console.log("Oauth");
            state.isAuthenticated = true;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    }
});

export const {login, logout, oauth, setUser} = authSlice.actions;

export const getIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;