import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    todos: [],
    status: 'idle',
    error: null,
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        allTodos: (state, action) => {
          state.todos = action.payload;
        },
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
        toggleTodo: (state, action) => {
            const todo = state.todos.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.status = action.payload.status;
            }
        },
        setTodos: (state, action) => {
            state.todos = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {allTodos, addTodo, removeTodo, toggleTodo,setTodos, setStatus, setError } = todoSlice.actions;

export const getAllTodos = (state) => state.todos.todos;
export default todoSlice.reducer;
