import React, {useState} from "react";
import s from "./NewToDo.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useCreateTodoMutation} from "../../services/api/todoApi";
import {addTodo} from "../../redux/todos/todoSlice.js";
import Button from "../Button/Button.jsx";
import {getAllProjects} from "../../redux/projects/projectsSlice.js";
import CustomDropdown from "../CustomDropdown/CustomDropdown.jsx";
import CustomSelect from "../CustomDropdown/CustomDropdown.jsx";
import {getUser} from "../../redux/auth/authSlice.js";
import {closeModal} from "../../redux/dashboard/dashboardSlice.js";


function NewToDo({onSuccess}) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [projectId, setProjectId] = useState('');
    //const [curriculumId, setCurriculumId] = useState('');
    //const [availableCurricula, setAvailableCurricula] = useState([]);

    const currentUser = useSelector(getUser);
    const projects = useSelector(getAllProjects);
    const [createTodo] = useCreateTodoMutation();


    const handleAddTodo = async () => {
        if (title.trim().length < 5 || description.trim().length < 5) {
            alert('Titel und Beschreibung müssen mindestens 5 Zeichen lang sein.');
            return;
        }

        try {
            const newTodo = {
                title,
                creator: currentUser.id,
                description,
                startDate,
                endDate,
                status,
                projectId: projectId || null,
                curriculumIds: []
            };

            const response = await createTodo(newTodo).unwrap();
            dispatch(addTodo(response));
            onSuccess();

        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Fehler beim Speichern des ToDos");
        }
    };

    const handleCancelAddTodo = async () => {
        dispatch(closeModal());
    }

    return (

        <div className={s.newTodoBox}>

            <h2 className={s.h2NewTodo}>Neues ToDo erstellen</h2>

            <label className={s.title}>
                <input
                    type="text"
                    className={s.inputTitle}
                    placeholder="Gib einen Titel ein..."
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
                                placeholder="Gib eine Beschreibung ein..."
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

            <CustomDropdown
                value={status}
                required
                options={[
                    {value: "", label: "Status wählen"},
                    {value: "TODO", label: "TODO"},
                    {value: "DOING", label: "DOING"},
                    {value: "DONE", label: "DONE"},
                ]}

                onChange={(chosenStatus) => setStatus(chosenStatus)}
            />

            <CustomSelect
                value={projectId}
                options={[
                    {value: "", label: "Projekt wählen (optional)"},
                    ...projects.map((project) => ({
                        value: project.id,
                        label: project.title,
                    })),
                ]}
                onChange={(projectId) => setProjectId(projectId)}
            />

            <div className={s.buttonBox}>
                <Button className={s.saveBtn} onClick={handleAddTodo} text={'Speichern'}/>
                <Button className={s.cancelBtn} onClick={handleCancelAddTodo} text={'Abbrechen'}/>
            </div>

        </div>
    );
}

export default NewToDo;

