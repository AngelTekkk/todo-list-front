import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createProject,
    loadProjects,
} from "../redux/projects/projectsSlice";

export default function CreateProjectForm() {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.projects.status);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const canSave =
        Boolean(title) && Boolean(description) && status !== "loading";

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSave) return;

        try {
            // 1) ein Projekt erstellen
            await dispatch(createProject({ title, description })).unwrap();

            +(
                // 2) die Form reinigen
                setTitle("")
            );
            setDescription("");

            +(
                // 3) перезагружаем весь список, чтобы наверняка увидеть новый проект
                dispatch(loadProjects())
            );
        } catch (err) {
            console.error("Failed to save the project: ", err);
        }
    };

    // Вот тут возвращаем форму
    return (
        <form onSubmit={onSubmit} className="mb-4">
            <div className="mb-2">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="mb-2">
        <textarea
            className="form-control"
            placeholder="Project description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!canSave}>
                {status === "loading" ? "Saving…" : "Create Project"}
            </button>
        </form>
    );
}