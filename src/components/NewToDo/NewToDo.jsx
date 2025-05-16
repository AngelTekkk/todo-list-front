import React, {useEffect, useState} from "react";
import s from "./NewToDo.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useCreateTodoMutation} from "../../services/api/todoApi";
import {addTodo} from "../../redux/todos/todoSlice.js";
import Button from "../Button/Button.jsx";



function NewToDo({onSuccess}) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [creator,
        // setCreator
    ] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [projectId, setProjectId] = useState('');
    //const [curriculumId, setCurriculumId] = useState('');
    const [availableProjects, setAvailableProjects] = useState([]);
    //const [availableCurricula, setAvailableCurricula] = useState([]);

    const projects = useSelector((state) => state.projects.items);
    const projectStatus = useSelector((state) => state.projects.status);
    const projectError = useSelector((state) => state.projects.error);

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
                projectId: projectId || null,
                curriculumIds: []
            };


            await createTodo(newTodo).unwrap();
            dispatch(addTodo(newTodo));
            onSuccess();



        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Fehler beim Speichern des ToDos");
        }
    };

    useEffect(() => {
        if (projectStatus === 'idle') {
            dispatch(projects);
        }
    }, [dispatch, projectStatus, projects]);

    useEffect(() => {
        if (projects.length > 0) {
            setAvailableProjects(projects);
        }
    }, [projects]);

    if (projectStatus === 'loading') return <p>Lade Projekte…</p>;
    if (projectStatus === 'failed') return <p>Fehler: {projectError}</p>;

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
                        <Button
                            // className={`${s.saveBtn} ${s.text}`}
                            onClick={handleAddTodo}
                            text={'Speichern'}

                        />


                        <button
                            // className={`${s.cancelBtn} ${s.text}`}
                        >Abbrechen</button>
                    </div>
                </div>
            </div>

        </>
    );

}

export default NewToDo;

