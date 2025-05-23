import React, {useEffect, useState} from 'react';
import {useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation} from '../../services/api/todoApi';
import s from './UpdateTodoPage.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {getAllTodos, removeTodo, setUpdatedTodo} from "../../redux/todos/todoSlice.js";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";
import CustomSelect from "../CustomDropdown/CustomDropdown.jsx";
import {useGetProjectsQuery} from "../../services/api/projectApi.js";


function UpdateTodoPage({onSuccess}) {
    const dispatch = useDispatch();
    const id = useSelector(getTodoId);

    const {data: todos, isLoading} = useGetTodosQuery();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [
        status,
        setStatus] = useState('');
    const [projectId, setProjectId] = useState('');



    const {
        data: projects = [],
        isLoadingProjects,
        isError,
        error,
    } = useGetProjectsQuery();

    useEffect(() => {
        if (todos) {
            const currentTodo = todos.find(t => t.id === id);
            if (currentTodo) {
                setTitle(currentTodo.title || '');
                setDescription(currentTodo.description || '');
                setStartDate(currentTodo.startDate || '');
                setEndDate(currentTodo.endDate || '');
                setStatus(currentTodo.status || '');
                setProjectId(currentTodo.project?.id || '');
            }
        }
    }, [todos, id]);

    if (isLoading) return <p>Lade Todo…</p>;

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo({id}));
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
            status,
            projectId
        };

        try {
            await updateTodo({id, updatedTodo}).unwrap();
            dispatch(setUpdatedTodo({id, updatedTodo}));
            onSuccess();
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
            alert('Fehler beim Speichern des Todos.');
        }
    };

    const getProjectTitle = (projectId) => {
        const project = projects?.find(p => p.id === projectId);
        return project ? project.title : '---';
    };

    if (isLoadingProjects) return <p>Lade Projekte…</p>;
    if (isError) return <p>Fehler: {error?.message || "Unbekannter Fehler"}</p>;

    const onSetStatus = (id, status) => {
        setStatus(status);
    };

    const handleProjectChange = (id, projectId) => {
        setProjectId(projectId);
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

                    <CustomSelect
                        value={todo.status}
                        options={[
                            {value: "TODO", label: "TODO"},
                            {value: "DOING", label: "DOING"},
                            {value: "DONE", label: "DONE"},
                        ]}
                        onChange={(newStatus) => onSetStatus(todo.id, newStatus)}
                    />

                    <CustomSelect
                        value={todo.project?.id || ""}
                        options={[
                            {value: "", label: getProjectTitle(todo.projectId)},
                            ...projects.map((project) => ({
                                value: project.id,
                                label: project.title,
                            })),
                        ]}
                        onChange={(newProjectId) => handleProjectChange(todo.id, newProjectId)}
                    />

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