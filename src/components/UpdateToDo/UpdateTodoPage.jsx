import React, { useEffect, useState } from 'react';
import {
    useGetTodosQuery,
    useDeleteTodoMutation,
    useUpdateTodoMutation
} from '../../services/api/todoApi';
import s from './UpdateTodoPage.module.scss';
import {useDispatch, useSelector} from "react-redux";
import { removeTodo, setUpdatedTodo } from "../../redux/todos/todoSlice.js";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";

function UpdateTodoPage({onSuccess}) {
    const dispatch = useDispatch();
    const id = useSelector(getTodoId);

    const { data: todos, isLoading } = useGetTodosQuery();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (todos) {
            const currentTodo = todos.find(t => t.id === id);
            if (currentTodo) {
                setTitle(currentTodo.title || '');
                setDescription(currentTodo.description || '');
                setStartDate(currentTodo.startDate || '');
                setEndDate(currentTodo.endDate || '');
                setStatus(currentTodo.status || '');
            }
        }
    }, [todos, id]);

    if (isLoading) return <p>Lade Todo…</p>;

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo({ id }));
            onSuccess();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
            alert('Fehler beim Löschen des Todos.');
        }
    };

    const handleUpdateTodo = async () => {
        if (title.trim().length < 5 || description.trim().length < 5) {
            alert('Titel und Beschreibung müssen mindestens 5 Zeichen lang sein.');
            return;
        }

        const updatedTodo = {
            title,
            description,
            startDate,
            endDate,
            status
        };

        try {
            await updateTodo({ id, updatedTodo }).unwrap();
            dispatch(setUpdatedTodo({ id, updatedTodo }));
            onSuccess();
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
            alert('Fehler beim Speichern des Todos.');
        }
    };

    return (
        <div className={s.bigContainer}>
            <div className={s.newTodoBox}>
                <h2>TODO ÄNDERN</h2>
                <div className={s.newTodoWrapper}>
                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Titel:
                            <input
                                type="text"
                                className={s.inputDescription}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                minLength={5}
                                maxLength={25}
                            />
                        </label>
                    </div>

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Beschreibung:
                            <textarea
                                className={`${s.textarea} ${s.text}`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                minLength={5}
                                maxLength={255}
                            />
                        </label>
                    </div>

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Startdatum:
                            <input
                                type="date"
                                className={s.input}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Enddatum:
                            <input
                                type="date"
                                className={s.input}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                required

                            />
                        </label>
                    </div>

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Status:
                            <select
                                className={s.input}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="">Bitte wählen...</option>
                                <option value="TODO">TODO</option>
                                <option value="DOING">DOING</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </label>
                    </div>

                    <div className={s.buttonRow}>
                        <button onClick={handleDeleteTodo}>Löschen</button>
                        <button
                            className={`${s.saveBtn} ${s.text}`}
                            onClick={handleUpdateTodo}
                        >
                            Speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateTodoPage;