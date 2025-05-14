import React, { useEffect, useState } from 'react';
import { useDeleteTodoMutation, useGetTodoQuery, useUpdateTodoMutation } from '../../services/api/todoApi';
import { useNavigate, useParams } from 'react-router-dom';
import s from './UpdateTodoPage.module.scss';

function UpdateTodoPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: todo, error, isLoading } = useGetTodoQuery(id);
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');


    useEffect(() => {
        if (todo) {
            setTitle(todo.title || '');
            setDescription(todo.description || '');
            setStartDate(todo.startDate || '');
            setEndDate(todo.endDate || '');
            setStatus(todo.status || '');
        }
    }, [todo]);

    if (isLoading) return <p>Lade Todo…</p>;
    if (error) return <p>Fehler beim Laden des Todos: {error.message}</p>;

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(id).unwrap();
            navigate(-1);
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
            await updateTodo({id, updatedTodo}).unwrap();
            navigate(-1);
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
            alert('Fehler beim Speichern des Todos.');
        }
    };

    return (
        <div className={s.bigContainer}>
            <div className={s.newTodoBox}>
                <h2>TODO ÄNDERN {id}</h2>
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
                                maxLength={255}
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
                                <option value="TODO">Zu erledigen</option>
                                <option value="DOING">In Bearbeitung</option>
                                <option value="DONE">Erledigt</option>
                            </select>
                        </label>
                    </div>

                    <div className="btn container">
                        <button onClick={handleDeleteTodo}>Löschen</button>
                        <button
                            className={`${s.saveBtn} ${s.text}`}
                            onClick={handleUpdateTodo}
                        >
                            Speichern
                        </button>
                        <button
                            className={`${s.cancelBtn} ${s.text}`}
                            onClick={() => navigate(-1)}
                        >
                            Abbrechen
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UpdateTodoPage;