import React, { useState } from 'react';
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from '../../services/api/projectApi';
import CreateProjectForm from '../../components/NewProject/CreateProjectForm.jsx';
import s from './ProjectsPage.module.scss';

export default function ProjectsPage() {
    const { data: projects = [], isLoading, isError } = useGetProjectsQuery();
    const [createProject] = useCreateProjectMutation();
    const [updateProject] = useUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Вспомогательные для расчёта периода
    const getEarliest = (tasks) =>
        tasks?.length
            ? tasks.reduce(
                (min, t) => (t.startDate < min ? t.startDate : min),
                tasks[0].startDate
            )
            : '';
    const getLatest = (tasks) =>
        tasks?.length
            ? tasks.reduce(
                (max, t) => (t.endDate > max ? t.endDate : max),
                tasks[0].endDate
            )
            : '';

    if (isLoading) return <p>Loading projects…</p>;
    if (isError) return <p>Error loading projects</p>;

    // 1) Режим удаления с подтверждением
    if (selectedProject && confirmDelete) {
        return (
            <div className={s.page}>
                <div className={s.overlay}>
                    <div className={s.confirmBox}>
                        <p>Wirklich Projekt löschen?</p>
                        <button
                            onClick={async () => {
                                await deleteProject(selectedProject.id).unwrap();
                                setSelectedProject(null);
                                setConfirmDelete(false);
                            }}
                        >
                            Bestätigen
                        </button>
                        <button onClick={() => setConfirmDelete(false)}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

    // 2) Режим редактирования
    if (selectedProject && editingProject) {
        return (
            <div className={s.page}>
                <CreateProjectForm
                    initialTitle={selectedProject.title}
                    initialDescription={selectedProject.description}
                    submitLabel="Speichern"
                    onSubmit={async ({ title, description }) => {
                        await updateProject({
                            id: selectedProject.id,
                            title,
                            description,
                        }).unwrap();
                        setEditingProject(false);
                    }}
                    onCancel={() => setEditingProject(false)}
                />
            </div>
        );
    }

    // 3) Карточка выбранного проекта
    if (selectedProject) {
        return (
            <div className={s.page}>
                <button
                    className={s.editBtn}
                    onClick={() => setEditingProject(true)}
                >
                    Редактieren
                </button>
                <button
                    className={s.deleteBtn}
                    onClick={() => setConfirmDelete(true)}
                >
                    Löschen
                </button>
                <button
                    className={s.backBtn}
                    onClick={() => setSelectedProject(null)}
                >
                    Zurück zur Projekte
                </button>
                <div className={s.card}>
                    <h2>{selectedProject.title}</h2>
                    <p>
                        <strong>Beschreibung:</strong>{' '}
                        {selectedProject.description}
                    </p>
                    <p>
                        <strong>Zeitraum:</strong>{' '}
                        {getEarliest(selectedProject.tasks)} –{' '}
                        {getLatest(selectedProject.tasks)}
                    </p>
                    <h3>Aufgaben:</h3>
                    {selectedProject.tasks?.length ? (
                        <ul>
                            {selectedProject.tasks.map((t) => (
                                <li key={t.id}>
                                    <strong>{t.title}</strong> (
                                    {t.startDate} – {t.endDate})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Keine Aufgaben in diesem Projekt.</p>
                    )}
                </div>
            </div>
        );
    }

    // 4) Список проектов + кнопка создания
    return (
        <div className={s.page}>
            <h1 className={s.heading}>Deine Projekte</h1>
            {!showForm ? (
                <button
                    className={s.createBtn}
                    onClick={() => setShowForm(true)}
                >
                    Projekt herstellen
                </button>
            ) : (
                <CreateProjectForm
                    submitLabel="Create Project"
                    onSubmit={async ({ title, description }) => {
                        await createProject({ title, description }).unwrap();
                        setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}
            {projects.length === 0 ? (
                <p>Sie haben noch keine Projekte.</p>
            ) : (
                <table className={s.table}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Titel</th>
                        <th>Beschreibung</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((p, idx) => (
                        <tr
                            key={p.id}
                            onClick={() => setSelectedProject(p)}
                            className={s.tr}
                        >
                            <td>{idx + 1}</td>
                            <td>{p.title}</td>
                            <td>{p.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}





