import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modalType: null, // Could be just 'login' | 'register' | null
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.modalType = action.payload;
        },
        closeModal: (state) => {
            state.modalType = null;
        }
    }
});

export const {openModal, closeModal} = dashboardSlice.actions;

export const getModalType = (state) => state.dashboard.modalType;

export default dashboardSlice.reducer;