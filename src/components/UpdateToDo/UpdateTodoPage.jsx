import React, {useEffect, useState} from 'react';
import {useDeleteTodoMutation, useUpdateTodoMutation} from '../../services/api/todoApi';
import s from './UpdateTodoPage.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {getAllTodos, removeTodo, setUpdatedTodo} from "../../redux/todos/todoSlice.js";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";
import CustomSelect from "../CustomDropdown/CustomDropdown.jsx";
import {getAllProjects} from "../../redux/projects/projectsSlice.js";


function UpdateTodoPage({onSuccess}) {
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
            dispatch(removeTodo(id));
            onSuccess();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
            alert('Fehler beim Löschen des Todos.');
        }
        console.log("Dein Todo isch im eimer")
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
            console.log(updatedTodo)
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

        <div className={s.updateTodoBox}>

            <h2 className={s.h2Todo}>TODO ÄNDERN</h2>

            <label className={s.title}>
                <input
                    type="text"
                    className={s.inputTitle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={5}
                    maxLength={25}
                />
            </label>

            <label className={s.description}>
                <textarea
                    className={s.inputDescription}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={5}
                    maxLength={255}
                />
            </label>

            <label className={s.startDate}>
                <input
                    type="date"
                    className={s.inputStartDate}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </label>

            <label className={s.endDate}>
                <input
                    type="date"
                    className={s.inputEndDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    required

                />
            </label>

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

            <div className={s.buttonBox}>

                <button className={s.saveBtn} onClick={handleUpdateTodo}>Speichern</button>

                <button className={s.deleteBtn} value={todoForUpdate.id} onClick={handleDeleteTodo}>Löschen</button>

            </div>
        </div>

    );
}

export default UpdateTodoPage;