import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    curriculum: {},
    status: 'idle',
    error: null,
};

const curriculumSlice = createSlice({
    name: 'curriculum',
    initialState,
    reducers: {
        showCurriculum: (state, action) => {
            state.curriculum = action.payload;
        },
        createCurriculum: (state, action)=>{
            state.curriculum = action.payload;
        },
        deleteCurriculum: (state, action)=>{
            state.curriculum = action.payload;
        }
    }
})
export const { showCurriculum, createCurriculum, deleteCurriculum } = curriculumSlice.actions;

export default curriculumSlice.reducer;