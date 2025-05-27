import React, { useState, useEffect } from "react";
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "../../services/api/projectApi.js";
import {
    useGetTodosQuery,
    useUpdateTodoMutation,
} from "../../services/api/todoApi.js";
import s from "./ProjectsPage.module.scss";

export default function ProjectsPage() {
    const {
        data: projects = [],
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
        refetch: refetchProjects,
    } = useGetProjectsQuery();
    const [createProject, { isLoading: isCreating, isError: createError }] =
        useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating, isError: updateError }] =
        useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting, isError: deleteError }] =
        useDeleteProjectMutation();

    const { data: allTodos = [] } = useGetTodosQuery();
    const [updateTodo] = useUpdateTodoMutation();

    // — local UI state —
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showAddTasks, setShowAddTasks] = useState(false);

    // form fields
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // for checkboxes
    const [checkedIds, setCheckedIds] = useState(new Set());

    // selected project & its local task-list
    const selectedProject = projects.find((p) => p.id === selectedId) || null;
    const [localTasks, setLocalTasks] = useState([]);

    // when project changes, reset local state
    useEffect(() => {
        if (selectedProject) {
            setLocalTasks(selectedProject.tasks || []);
            setShowAddTasks(false);
            setCheckedIds(new Set());
            setIsEditing(false);
        }
    }, [selectedProject]);

    // prefill edit form
    useEffect(() => {
        if (isEditing && selectedProject) {
            setEditTitle(selectedProject.title);
            setEditDescription(selectedProject.description);
        }
    }, [isEditing, selectedProject]);

    if (isLoadingProjects) return <p>Loading projects…</p>;
    if (isErrorProjects) return <p>Error loading projects</p>;

    // date-range helpers
    const getEarliest = (tasks = []) =>
        tasks.length
            ? tasks.reduce((min, t) => (t.startDate < min ? t.startDate : min), tasks[0].startDate)
            : "";
    const getLatest = (tasks = []) =>
        tasks.length
            ? tasks.reduce((max, t) => (t.endDate > max ? t.endDate : max), tasks[0].endDate)
            : "";

    // ——— CARD VIEW ———
    if (selectedProject) {
        const { title, description } = selectedProject;
        const tasks = localTasks;

        // DELETE
        const handleDelete = async () => {
            if (!window.confirm("Wollen wir das Projekt wirklich löschen?")) return;
            await deleteProject(selectedProject.id).unwrap();
            setSelectedId(null);
        };

        // UPDATE PROJECT META
        const handleProjectConfirm = async (e) => {
            e.preventDefault();
            await updateProject({
                id: selectedProject.id,
                title: editTitle.trim(),
                description: editDescription.trim(),
            }).unwrap();
            setIsEditing(false);
            await refetchProjects();
        };

        // available todos to add
        const available = allTodos.filter((t) => !tasks.some((x) => x.id === t.id));

        // toggle checkbox
        const toggleCheck = (id) => {
            setCheckedIds((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        };

        // ADD SELECTED TODOS TO PROJECT
        const handleAddTasks = async () => {
            try {
                // для каждого отмеченного — обновляем его projectId
                for (const t of available.filter((t) => checkedIds.has(t.id))) {
                    await updateTodo({ id: t.id, projectId: selectedProject.id }).unwrap();
                }
                // ре-фетчим проекты, чтобы подтянуть свежий список задач
                await refetchProjects();
                setShowAddTasks(false);
                setCheckedIds(new Set());
            } catch (err) {
                console.error("Fehler beim Hinzufügen der Aufgaben:", err);
            }
        };

        return (
            <div className={s.page}>
                <button
                    className={s.backBtn}
                    onClick={() => {
                        setSelectedId(null);
                        setIsEditing(false);
                    }}
                >
                    ← Zurück zu Projekte
                </button>

                <div className={s.card}>
                    {isEditing ? (
                        <form onSubmit={handleProjectConfirm} className={s.editForm}>
                            <div className={s.field}>
                                <label htmlFor="title">Titel:</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    disabled={isUpdating}
                                    className={s.input}
                                />
                            </div>
                            <div className={s.field}>
                                <label htmlFor="description">Beschreibung:</label>
                                <textarea
                                    id="description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    disabled={isUpdating}
                                    className={s.textarea}
                                />
                            </div>
                            <div className={s.buttons}>
                                <button type="submit" disabled={isUpdating}>
                                    {isUpdating ? "Bestätigen…" : "Bestätigen"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isUpdating}
                                >
                                    Absagen
                                </button>
                            </div>
                            {updateError && (
                                <p className={s.error}>Fehler beim Speichern des Projekts.</p>
                            )}
                        </form>
                    ) : (
                        <>
                            <div className={s.cardActions}>
                                <button onClick={() => setIsEditing(true)}>Korrigieren</button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    style={{ marginLeft: 8 }}
                                >
                                    {isDeleting ? "Löschen…" : "Löschen"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddTasks(true);
                                        setCheckedIds(new Set());
                                    }}
                                    style={{ marginLeft: 8 }}
                                >
                                    Eine Aufgabe hinzufügen
                                </button>
                            </div>

                            {showAddTasks && (
                                <div className={s.addTasks}>
                                    <h4>Verfügbare Aufgaben auswählen:</h4>
                                    <ul className={s.taskList}>
                                        {available.map((t) => (
                                            <li key={t.id} className={s.taskItem}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedIds.has(t.id)}
                                                        onChange={() => toggleCheck(t.id)}
                                                    />{" "}
                                                    {t.title} ({t.startDate} – {t.endDate})
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={s.buttons}>
                                        <button onClick={handleAddTasks}>Hinzufügen</button>
                                        <button onClick={() => setShowAddTasks(false)}>
                                            Absagen
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={s.cardHeader}>
                                <h2 className={s.cardTitle}>{title}</h2>
                            </div>
                            <div className={s.cardBody}>
                                <p>
                                    <strong>Beschreibung:</strong> {description}
                                </p>
                                <p>
                                    <strong>Zeitraum:</strong>{" "}
                                    {tasks.length
                                        ? `${getEarliest(tasks)} – ${getLatest(tasks)}`
                                        : "—"}
                                </p>

                                <h3>Aufgaben:</h3>
                                {tasks.length ? (
                                    <ul className={s.taskList}>
                                        {tasks.map((t) => (
                                            <li key={t.id} className={s.taskItem}>
                                                <strong>{t.title}</strong> ({t.startDate} – {t.endDate})
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={s.noTasks}>
                                        Keine Aufgaben in diesem Projekt.
                                    </p>
                                )}
                                {deleteError && (
                                    <p className={s.error}>Fehler beim Löschen des Projekts.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ——— LIST + New Form ———
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) return;
        await createProject({
            title: newTitle.trim(),
            description: newDescription.trim(),
        }).unwrap();
        setShowNewForm(false);
        setNewTitle("");
        setNewDescription("");
    };

    return (
        <div className={s.page}>
            <h1 className={s.heading}>Deine Projekte</h1>

            {!showNewForm ? (
                <button className={s.newBtn} onClick={() => setShowNewForm(true)}>
                    Neues Projekt herstellen
                </button>
            ) : (
                <form onSubmit={handleCreate} className={s.newForm}>
                    <div className={s.field}>
                        <label htmlFor="newTitle">Titel:</label>
                        <input
                            id="newTitle"
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            disabled={isCreating}
                            className={s.input}
                        />
                    </div>
                    <div className={s.field}>
                        <label htmlFor="newDescription">Beschreibung:</label>
                        <textarea
                            id="newDescription"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            disabled={isCreating}
                            className={s.textarea}
                        />
                    </div>
                    <div className={s.buttons}>
                        <button type="submit" disabled={isCreating}>
                            {isCreating ? "Bestätigen…" : "Bestätigen"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowNewForm(false)}
                            disabled={isCreating}
                        >
                            Absagen
                        </button>
                    </div>
                    {createError && (
                        <p className={s.error}>Fehler beim Erstellen des Projekts.</p>
                    )}
                </form>
            )}

            {projects.length === 0 ? (
                <p className={s.noProjects}>Sie haben noch keine Projekte.</p>
            ) : (
                <table className={s.table}>
                    <thead>
                    <tr>
                        <th className={s.th}>#</th>
                        <th className={s.th}>Titel</th>
                        <th className={s.th}>Beschreibung</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((p, idx) => (
                        <tr
                            key={p.id}
                            className={s.tr}
                            onClick={() => {
                                setSelectedId(p.id);
                                setShowNewForm(false);
                            }}
                        >
                            <td className={s.td}>{idx + 1}</td>
                            <td className={s.td}>{p.title}</td>
                            <td className={s.td}>{p.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


