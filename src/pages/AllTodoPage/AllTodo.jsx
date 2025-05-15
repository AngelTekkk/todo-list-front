import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    useDeleteTodoMutation,
    useGetTodosQuery,
    useUpdateStatusTodoMutation
} from '../../services/api/todoApi';
import { allTodos, toggleTodo, removeTodo, getAllTodos } from '../../redux/todos/todoSlice';

function AllTodoPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: todos, error, isLoading } = useGetTodosQuery();
    const [deleteTodo] = useDeleteTodoMutation();
    const [updateStatus] = useUpdateStatusTodoMutation();

    useEffect(() => {
        if (!isLoading && todos) {
            dispatch(allTodos(todos));
        }
    }, [dispatch, isLoading, todos]);

    const fetchedTodos = useSelector(getAllTodos);

    const handleSetStatus = async (id, newStatus) => {
        const newStatusObject = { status: newStatus };
        try {
            await updateStatus({ newStatusObject, id }).unwrap();
            dispatch(toggleTodo({ id, newStatus }));
        } catch (err) {
            console.error('Fehler beim Aktualisieren des ToDos:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo(id));
        } catch (err) {
            console.error('Fehler beim Löschen des ToDos:', err);
        }
    };

    const renderTable = (status) => {
        const filteredTodos = fetchedTodos
            .filter((todo) => todo.status === status)
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        return (
            <section key={status}>
                <h2>{status}</h2>
                {filteredTodos.length === 0 ? (
                    <p>Keine ToDos im Status {status}.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                            <th>Fällig am</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTodos.map((todo) => (
                            <tr key={todo.id}>
                                <td>
                                    <button onClick={() => navigate(`/edit/${todo.id}`)}>📝</button>{' '}
                                    <button onClick={() => handleDelete(todo.id)}>🗑️</button>
                                </td>
                                <td>{todo.title}</td>
                                <td>{todo.description}</td>
                                <td>{todo.endDate}</td>
                                <td>
                                    <select
                                        value={todo.status}
                                        onChange={(e) => handleSetStatus(todo.id, e.target.value)}
                                    >
                                        <option value="TODO">TODO</option>
                                        <option value="DOING">DOING</option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        );
    };

    if (isLoading) return <p>Lade ToDos…</p>;
    if (error) return <p>Fehler beim Laden der ToDos: {error.message}</p>;

    return (
        <div>
            <h1>Alle ToDos</h1>
            {['TODO', 'DOING', 'DONE'].map(renderTable)}
        </div>
    );
}

export default AllTodoPage;
