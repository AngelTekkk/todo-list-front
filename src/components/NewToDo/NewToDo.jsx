import React, {useEffect, useState} from "react";
import s from "./NewToDo.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useCreateTodoMutation} from "../../services/api/todoApi";
import {addTodo} from "../../redux/todos/todoSlice.js";
import Button from "../Button/Button.jsx";
import { useGetProjectsQuery } from "../../services/api/projectApi";




function NewToDo({onSuccess}) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [creator] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [projectId, setProjectId] = useState('');
    const [availableProjects, setAvailableProjects] = useState([]);
    //const [curriculumId, setCurriculumId] = useState('');
    //const [availableCurricula, setAvailableCurricula] = useState([]);

    const {
        data: projects = [],
        isLoading,
        isError,
        error,
    } = useGetProjectsQuery();

    const [createTodo] = useCreateTodoMutation();

    const handleAddTodo = async () => {
        if (title.trim().length < 5 || description.trim().length < 5) {
            alert('Titel und Beschreibung müssen mindestens 5 Zeichen lang sein.');
            return;
        }

        try {
            const newTodo = {
                title,
                creator,
                description,
                startDate,
                endDate,
                status,
                // projectId: projectId || null,
                // curriculumIds: []
            };

            const response = await createTodo(newTodo).unwrap();
            dispatch(addTodo(response));
            onSuccess();

        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Fehler beim Speichern des ToDos");
        }
    };

    useEffect(() => {
        if (projects.length > 0) {
            setAvailableProjects(projects);
        }
    }, [projects]);

    if (isLoading) return <p>Lade Projekte…</p>;
    if (isError) return <p>Fehler: {error?.message || "Unbekannter Fehler"}</p>;

    return (
        <>

            <div className={s.newTodoBox}>
                <h2>Neues ToDo erstellen</h2>
                <div className={s.newTodoWrapper}>

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Titel:
                            <input
                                type="text"
                                className={s.inputDescription}
                                placeholder="Gib einen Titel ein..."
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
                                placeholder="Gib eine Beschreibung ein..."
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

                    <div className={s.inputRow}>
                        <label className={s.text}>
                            Projekt (optional):
                            <select
                                className={s.input}
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                            >
                                <option value="">Kein Projekt</option>
                                {availableProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/*<div className={s.inputRow}>*/}
                    {/*    <label className={s.text}>*/}
                    {/*        Curriculum (optional):*/}
                    {/*        <button className={s.assignToCurriculaBtn} type={"button"}>Einem Lehrplan zuweisen*/}
                    {/*            ➡️ </button>*/}
                    {/*    </label>*/}
                    {/*</div>*/}

                    <div className="btn container">
                        <Button onClick={handleAddTodo} text={'Speichern'}/>
                        <Button text={'Abbrechen'} />
                    </div>
                </div>
            </div>

        </>
    );

}

export default NewToDo;

