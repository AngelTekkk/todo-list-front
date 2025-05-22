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
            state.todos = [...state.todos].map(todo => {
                if (todo.id === action.payload.id) {
                    todo.status = action.payload.newStatus;
                }
                return todo;
            })
        },
        setUpdatedTodo: (state, action) => {
            state.todos = [...state.todos].map(todo => {
                if (todo.id === action.payload.id) {
                    todo = action.payload.updatedTodo;
                }
                return todo;
            })

        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {allTodos, addTodo, removeTodo, toggleTodo,setUpdatedTodo, setStatus, setError } = todoSlice.actions;

export const getAllTodos = (state) => state.todos.todos;
export default todoSlice.reducer;
