import React, { useEffect } from 'react';
import {useDeleteTodoMutation, useGetTodosQuery, useUpdateStatusTodoMutation} from '../../services/api/todoApi';
import s from './TodoPage.module.scss';
import  { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {allTodos, toggleTodo, getAllTodos} from "../../redux/todos/todoSlice.js";


function TodoPage() {
    const {data: todos, error, isLoading} = useGetTodosQuery();
    const [deleteTodo] = useDeleteTodoMutation();
    const [updateStatus] = useUpdateStatusTodoMutation();
    const navigate = useNavigate();
    // const location = useLocation();
    const dispatch = useDispatch();
    // dispatch(allTodos(todos))

    useEffect(() => {
        if (!isLoading) {
            dispatch(allTodos(todos));
        }
    }, [dispatch, todos, isLoading]);


    // useEffect(() => {
    //     refetch();
    // }, [location.key, refetch]);

    const fetchedTodos = useSelector(getAllTodos);

    if (isLoading) return <p>Lade Todos…</p>;
    if (error) return <p>Fehler beim Laden der Todos: {error.message}</p>;

    const handleToggleStatus = async (id, status) => {
        const newStatusObject = {status: status === 'TODO' ? 'DOING' : status === 'DOING' ? 'DONE' : 'TODO'};
        try {
            toggleTodo({id, status});
            await updateStatus({newStatusObject, id}).unwrap();
        } catch (err) {
            console.error("Fehler beim Aktualisieren des ToDos:", err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            navigate(0);
        } catch (err) {
            console.error("Fehler beim Löschen des ToDos:", err);
        }
    };

    return (
        <div className={s.todoList}>
            <h2>Deine ToDos</h2>

            <a className={s.goToNewToDo} type="button" href="/createNewTodo">
                Ein neues ToDo erstellen ➡️
            </a>

            <div className={s.todoCards}>
                {[...fetchedTodos]
                    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate)).map((todo) => (
                    <div key={todo.id} className={s.todoCard}>
                        <button
                            className={s.todoUpdateLink}
                            onClick={() => navigate(`/updateToDo/${todo.id}`)}
                        >
                            Todo ändern
                        </button>
                        <p className={s.fancyStatus}>{todo.status}</p>
                        <h3 className={s.todoTitle}>{todo.title}</h3>
                        <p className={s.dueDate}><strong>Fällig am:</strong> {todo.endDate}</p>

                        <p className={s.hidden}><strong>Erstellt von:</strong> {todo.creator}</p>
                        <p className={s.hidden}><strong>Erstellt am:</strong> {todo.startDate}</p>
                        <p className={`${s.description} ${s.hidden}`}><strong>Todo:</strong> {todo.description}</p>

                        <div className={`${s.cardActions} ${s.hidden}`}>

                        <button onClick={() => handleToggleStatus(todo.id, todo.status)}>
                                {todo.status === 'TODO' ? 'DOING' : 'DONE'}
                            </button>
                            <button onClick={() => handleDeleteTodo(todo.id)}>Löschen</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>




    );
}

export default TodoPage;