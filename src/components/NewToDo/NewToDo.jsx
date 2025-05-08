import {addTodo} from "../../redux/todos/todoSlice.js";
import React, {useEffect, useState} from "react";
import s from "../../pages/todo/TodoPage.module.scss";
import {useDispatch} from "react-redux";



function NewToDo() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [projectId, setProjectId] = useState('');
    const [curriculumId, setCurriculumId] = useState('');
    const [availableProjects, setAvailableProjects] = useState([]);
    // const [availableCurricula, setAvailableCurricula] = useState([]);



    const handleAddTodo = () => {
        if (title.trim().length < 5 || description.trim().length < 5) {
            alert('Titel und Beschreibung müssen mindestens 5 Zeichen lang sein.');
            return;
        }

        dispatch(addTodo({
            id: Date.now(),
            title,
            description,
            startDate,
            endDate,
            status,
            projectId: projectId || null,
            curriculumId,
            completed: false
        }));

        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setStatus('');
        setProjectId('');
        setCurriculumId([]);
    };


    useEffect(() => {
        fetch('/todo-list-api/projects')
            .then(res => res.json())
            .then(data => setAvailableProjects(data))
            .catch(err => console.error('Fehler beim Laden der Projekte:', err));

        // fetch('/todo-list-api/curricula')
        //     .then(res => res.json())
        //     .then(data => setAvailableCurricula(data))
        //     .catch(err => console.error('Fehler beim Laden der Curricula:', err));
    }, []);

    return (
        <>

            <div className={s.bigContainer}>

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
                                    maxLength={255}
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

                        {/*<div className={s.inputRow}>*/}
                        {/*    <label className={s.text}>*/}
                        {/*        Status:*/}
                        {/*        <select*/}
                        {/*            className={s.input}*/}
                        {/*            value={status}*/}
                        {/*            onChange={(e) => setStatus(e.target.value)}*/}
                        {/*            required*/}
                        {/*        >*/}
                        {/*            <option value="">Bitte wählen...</option>*/}
                        {/*            <option value="TODO">Zu erledigen</option>*/}
                        {/*            <option value="DOING">In Bearbeitung</option>*/}
                        {/*            <option value="DONE">Erledigt</option>*/}
                        {/*        </select>*/}
                        {/*    </label>*/}
                        {/*</div>*/}

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
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className={s.inputRow}>
                            <label className={s.text}>
                                Curriculum (optional):
                                <button className={s.assignToCurriculaBtn} type={"button"}>Einem Lehrplan zuweisen ➡️ </button>
                            </label>
                        </div>

                        <div className="btn container">
                            <button
                                className={`${s.saveBtn} ${s.text}`}
                                onClick={handleAddTodo}
                            >
                                Speichern
                            </button>
                            <button className={`${s.cancelBtn} ${s.text}`}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            </div>
            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

                Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.

                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

                Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.

                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

                Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

                Duis autem vel eum iriure dolor in
            </p>
        </>
    );

}

export default NewToDo;

