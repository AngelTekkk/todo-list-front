import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProjects } from "../../redux/projects/projectsSlice";
import CreateProjectForm from "../../components/CreateProjectForm";

export default function ProjectsPage() {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.items);
    const status = useSelector((state) => state.projects.status);
    const error = useSelector((state) => state.projects.error);
    const message = useSelector((state) => state.projects.message);

    useEffect(() => {
        if (status === "idle") {
            dispatch(loadProjects());
        }
    }, [dispatch, status]);

    if (status === "loading") return <p>Loading projects…</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Projects</h1>

            {/* Formular zur Projekterstellung */}
            <CreateProjectForm />

            {/* Mitteilung über die erfolgreiche Durchführung des Projekts */}

            {message && <div className="alert alert-success">{message}</div>}

            {projects.length === 0 ? (
                <p>Sie haben noch keine Projekte</p>
            ) : (
                <ul>
                    {projects.map((p) => (
                        <li key={p.id}>
                            <strong>{p.title}</strong>
                            <br />
                            <small>{p.description}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}