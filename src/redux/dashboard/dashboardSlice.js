import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modalType: null,
    todoId: null// Could be just 'login' | 'register' | null
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.modalType = action.payload.type;
        },
        updateTodoModal: (state, action) => {
            state.modalType = action.payload.type;
            state.todoId = action.payload.todoId;
        },
        closeModal: (state) => {
            state.modalType = null;
            state.todoId = null;
        }
    }
});

export const {openModal, updateTodoModal, closeModal} = dashboardSlice.actions;

export const getModalType = (state) => state.dashboard.modalType;
export const getTodoId = (state) => state.dashboard.todoId;

export default dashboardSlice.reducer;