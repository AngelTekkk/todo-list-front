import React, {useEffect, useState} from 'react';
import {useDeleteTodoMutation, useUpdateTodoMutation} from '../../services/api/todoApi';
import s from './UpdateTodoPage.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {getAllTodos, removeTodo, setUpdatedTodo} from "../../redux/todos/todoSlice.js";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";
import CustomSelect from "../CustomDropdown/CustomDropdown.jsx";
import {getAllProjects} from "../../redux/projects/projectsSlice.js";


function UpdateTodoPage(onSuccess) {
    const dispatch = useDispatch();
    const id = useSelector(getTodoId);
    const allTodos = useSelector(getAllTodos);
    const projects = useSelector(getAllProjects);
    const todoForUpdate = allTodos.find((todo) => todo.id === id);

    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [projectId, setProjectId] = useState('');


    useEffect(() => {
        if (todoForUpdate) {
                setTitle(todoForUpdate.title || '');
                setDescription(todoForUpdate.description || '');
                setStartDate(todoForUpdate.startDate || '');
                setEndDate(todoForUpdate.endDate || '');
                setStatus(todoForUpdate.status || '');
                setProjectId(todoForUpdate.project?.id || '');
        }
    }, [todoForUpdate]);

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
                        value={todoForUpdate.status}
                        options={[
                            {value: "TODO", label: "TODO"},
                            {value: "DOING", label: "DOING"},
                            {value: "DONE", label: "DONE"},
                        ]}
                        onChange={(newStatus) => onSetStatus(todoForUpdate.id, newStatus)}
                    />

                    <CustomSelect
                        value={todoForUpdate.project?.id || ""}
                        options={[
                            {value: "", label: getProjectTitle(todoForUpdate.projectId)},
                            ...projects.map((project) => ({
                                value: project.id,
                                label: project.title,
                            })),
                        ]}
                        onChange={(newProjectId) => handleProjectChange(todoForUpdate.id, newProjectId)}
                    />

                    <div className={s.buttonRow}>
                        <button className={s.deleteBtn} onClick={handleDeleteTodo}>Löschen</button>
                        <button className={s.saveBtn} onClick={handleUpdateTodo}>Speichern</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateTodoPage;