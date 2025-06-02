// src/pages/Project/ProjectsPage.jsx
import React, { useState, useEffect } from "react";
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "../../services/api/projectApi.js";
import {
    useGetTodosQuery,
    useAssignToProjectMutation,
    useUpdateTodoMutation,
} from "../../services/api/todoApi.js";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../components/Button/Button.jsx";
import s from "./ProjectsPage.module.scss";
import arrowRightSrc from "../../assets/img/arrow-right.png";
import arrowLeftSrc from "../../assets/img/arrow-left.png";

const CARD_LIMIT = 4;
const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function ProjectsPage() {
    // RTK Query hooks
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
    const [assignToProject, { isLoading: isAssigning, isError: assignError }] =
        useAssignToProjectMutation();
    const [updateTodo] = useUpdateTodoMutation();  // ← добавили для удаления задачи из проекта

    // UI state
    const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);

    // form fields
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // for add-tasks checkboxes
    const [checkedIds, setCheckedIds] = useState(new Set())
    const [addIds, setAddIds] = useState(new Set());
    const [removeIds, setRemoveIds] = useState(new Set());

    // carousel paging
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const maxPage = Math.ceil(projects.length / CARD_LIMIT) - 1;

    // selected project & its local tasks
    const selectedProject =
        projects.find((p) => p.id === selectedId) || null;
    const [localTasks, setLocalTasks] = useState([]);

    // when switch to a project, reset local UI
    useEffect(() => {
        if (selectedProject) {
            setLocalTasks(selectedProject.tasks || []);
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
            ? tasks.reduce(
                (min, t) => (t.startDate < min ? t.startDate : min),
                tasks[0].startDate
            )
            : "";
    const getLatest = (tasks = []) =>
        tasks.length
            ? tasks.reduce(
                (max, t) => (t.endDate > max ? t.endDate : max),
                tasks[0].endDate
            )
            : "";

    // === Функция переключения карусели ===
    const paginate = (dir) => {
        if (selectedProject) {
            // режим детального просмотра: сдвигаем по списку projects
            const currentIndex = projects.findIndex(p => p.id === selectedId);
            const nextIndex = currentIndex + dir;
            if (nextIndex < 0 || nextIndex >= projects.length) return;
            setDirection(dir);
            setPage(nextIndex);
            setSelectedId(projects[nextIndex].id);
            // сброс режима редактирования
            setIsEditing(false);
        } else {
            // ваш прежний код для табличной карусели
            const next = page + dir;
            if (next < 0 || next > maxPage) return;
            setDirection(dir);
            setPage(next);
        }
    };

    // toggle between table and cards
    const toggleView = () =>
        setViewMode((m) => (m === "table" ? "cards" : "table"));

    // create new project
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

    // delete project
    const handleDelete = async (id) => {
        if (!window.confirm("Wollen wir das Projekt wirklich löschen?")) return;
        await deleteProject(id).unwrap();
        setSelectedId(null);
    };

    // save edits
    const handleSaveProject = async (e) => {
        e.preventDefault();
        // 1. Сохраняем title/description
        await updateProject({
            id: selectedProject.id,
            title: editTitle.trim(),
            description: editDescription.trim(),
        }).unwrap();

        // 2. Удаляем выбранные задачи
        if (removeIds.size > 0) {
            await Promise.all(
                Array.from(removeIds).map(todoId =>
                    updateTodo({
                        id: todoId,
                        updatedTodo: { projectId: null }
                    }).unwrap()
                )
            );
        }

        // 3. Добавляем выбранные задачи
        if (addIds.size > 0) {
            await Promise.all(
                Array.from(addIds).map(todoId =>
                    assignToProject({
                        todoId,
                        projectId: selectedProject.id,
                    }).unwrap()
                )
            );
        }

        // 4. Сбрасываем форму и рефетчим
        setRemoveIds(new Set());
        setAddIds(new Set());
        setIsEditing(false);
        await refetchProjects();
    };


    // add tasks logic
    const available = allTodos.filter(
        (t) => !localTasks.some((x) => x.id === t.id)
    );
    const toggleAdd = (id) => {
        setAddIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
            });
        };
    const toggleRemove = (id) => {
        setRemoveIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
            });
        };
    const handleAddTasks = async () => {
        try {
            await Promise.all(
                Array.from(checkedIds).map((todoId) =>
                    assignToProject({ todoId, projectId: selectedProject.id }).unwrap()
                )
            );
            await refetchProjects();
            setCheckedIds(new Set());
        } catch {
            console.error("Fehler beim Hinzufügen der Aufgaben");
        }
    };

    // — selected project card —
    if (selectedProject) {
        const { title, description } = selectedProject;
        const tasks = localTasks;

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

                <section className={s.section}>
                    <div className={s.carousel}>
                        <Button
                            className={s.arrowLeft}
                            onClick={() => paginate(-1)}
                            disabled={page === 0}  // если на первой карточке — влево неактивно
                        >
                            <img src={arrowLeftSrc} alt="←" className={s.arrowIcon} />
                        </Button>
                        <div className={s.projectCard}>
                            {isEditing ? (
                                <form onSubmit={handleSaveProject} className={s.editForm}>
                                    {/* — Мета проекта — */}
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

                                    {/* — Удалить задачи из проекта — */}
                                    <div className={s.addTasks}>
                                        <h4>Aufgabe löschen:</h4>
                                        <ul className={s.taskList}>
                                            {tasks.map((t) => (
                                                <li key={t.id} className={s.taskItem}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={removeIds.has(t.id)}
                                                            onChange={() => toggleRemove(t.id)}
                                                        />{" "}
                                                        {t.title} ({t.startDate} – {t.endDate})
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* — Добавить задачи в проект — */}
                                    <div className={s.addTasks}>
                                        <h4>Aufgabe hinzufügen:</h4>
                                        <ul className={s.taskList}>
                                            {available.map((t) => (
                                                <li key={t.id} className={s.taskItem}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={addIds.has(t.id)}
                                                            onChange={() => toggleAdd(t.id)}
                                                        />{" "}
                                                        {t.title} ({t.startDate} – {t.endDate})
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* — Общие кнопки — */}
                                    <div className={s.buttons}>
                                        <button
                                            type="submit"
                                            disabled={isUpdating || isAssigning}
                                        >
                                            {isUpdating || isAssigning
                                                ? "Bestätigen…"
                                                : "Bestätigen"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setRemoveIds(new Set());
                                                setAddIds(new Set());
                                            }}
                                            disabled={isUpdating || isAssigning}
                                        >
                                            Absagen
                                        </button>
                                    </div>

                                    {(updateError || assignError) && (
                                        <p className={s.error}>
                                            {updateError
                                                ? "Fehler beim Speichern des Projekts."
                                                : "Fehler beim Anpassen der Aufgaben."}
                                        </p>
                                    )}
                                </form>

                            ) : (
                                <>
                                    {/* — Просмотр мета — */}
                                    <div className={s.cardHeader}>
                                        <h2 className={s.cardTitle}>{title}</h2>
                                    </div>
                                    <div className={s.cardBody}>
                                        <button className={s.cardBtn}>
                                            <strong>Beschreibung:</strong> {description}
                                        </button>
                                        <button className={s.cardBtn}>
                                            <strong>Zeitraum:</strong>{" "}
                                            {tasks.length
                                                ? `${getEarliest(tasks)} – ${getLatest(tasks)}`
                                                : "—"}
                                        </button>
                                        <button className={s.cardBtn}>
                                        <h3>Aufgaben:</h3>
                                        {tasks.length ? (
                                            <ul className={s.taskList}>
                                                {tasks.map((t) => (
                                                    <li key={t.id} className={s.taskItem}>
                                                        <strong>{t.title}</strong> (
                                                        {t.startDate} – {t.endDate})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className={s.noTasks}>Keine Aufgaben.</p>
                                        )}
                                        </button>
                                    </div>

                                    {/* — Действия — */}
                                    <div className={s.cardActions}>
                                        <button
                                            className={s.updateBtn}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Korrigieren
                                        </button>
                                        <button
                                            className={s.deleteBtn}
                                            onClick={() => handleDelete(selectedProject.id)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Löschen…" : "Löschen"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <Button
                            className={s.arrowRight}
                            onClick={() => paginate(1)}
                            disabled={page === projects.length - 1} // если на последней — вправо неактивно
                        >
                            <img src={arrowRightSrc} alt="→" className={s.arrowIcon} />
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    // — Список или карточки —
    return (
        <div className={s.page}>
            <div className={s.headerRow}>
                <h1 className={s.heading}>Deine Projekte</h1>
                <button onClick={toggleView} className={s.newBtn}>
                    {viewMode === "table" ? "Card View" : "List View"}
                </button>
            </div>
            {!showNewForm ? (
                <button
                    className={s.newBtn}
                    onClick={() => setShowNewForm(true)}
                >
                    Neues Projekt herstellen
                </button>
            ) : (
                <section className={s.sectionNewForm}>
                    <form onSubmit={handleCreate} className={s.newForm}>
                        {/* форма создания */}
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
                        {createError && <p className={s.error}>Fehler beim Erstellen.</p>}
                    </form>
                </section>
            )}

            {viewMode === "table" ? (
                <>
                    <section className={s.section}>
                        <table className={s.table}>
                            <thead>
                            <tr>
                                <th className={s.th}>#</th>
                                <th className={s.th}>Titel</th>
                                <th className={s.th}>Beschreibung</th>
                                <th className={s.th}>Zeitraum</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projects.map((p, idx) => {
                                const tasks = p.tasks || [];
                                return (
                                    <tr
                                        key={p.id}
                                        className={s.tr}
                                        onClick={() => {
                                            setSelectedId(p.id);
                                            setShowNewForm(false);
                                            setPage(idx);
                                        }}
                                    >
                                        <td className={s.td}>{idx + 1}</td>
                                        <td className={s.td}>{p.title}</td>
                                        <td className={s.td}>{p.description}</td>
                                        <td className={s.td}>
                                            {tasks.length
                                                ? `${getEarliest(tasks)} – ${getLatest(tasks)}`
                                                : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </section>
                </>
            ) : (
                // CARDS VIEW
                <section className={s.section}>
                    <div className={s.carousel}>
                        <Button
                            className={s.arrowLeft}
                            onClick={() => paginate(-1)}
                            disabled={page === 0}
                        >
                            <img
                                src={arrowLeftSrc}
                                alt="←"
                                className={s.arrowIcon}
                            />
                        </Button>

                        <div className={s.todoCardGroup}>
                            <AnimatePresence custom={direction} initial={false} mode="wait">
                                <motion.div
                                    key={page}
                                    className={s.todoCardSet}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    {projects
                                        .slice(page * CARD_LIMIT, page * CARD_LIMIT + CARD_LIMIT)
                                        .map((p) => {
                                            const tasks = p.tasks || [];
                                            return (
                                                <div key={p.id} className={s.todoCard}>
                                                    <h4 className={s.todoTitle}>{p.title}</h4>
                                                    <div className={s.cardStuff}>
                                                        <p>
                                                            <strong>Beschreibung:</strong> {p.description}
                                                        </p>
                                                        <p>
                                                            <strong>Zeitraum:</strong>{" "}
                                                            {tasks.length
                                                                ? `${getEarliest(tasks)} – ${getLatest(tasks)}`
                                                                : "—"}
                                                        </p>
                                                    </div>
                                                    <div className={s.cardButtons}>
                                                        <Button
                                                            className={s.updateBtn}
                                                            onClick={() => setSelectedId(p.id)}
                                                        >
                                                            Details
                                                        </Button>
                                                        <Button
                                                            className={s.deleteBtn}
                                                            onClick={() => handleDelete(p.id)}
                                                        >
                                                            Löschen
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {/** placeholders **/}
                                    {Array.from({
                                        length:
                                            CARD_LIMIT -
                                            projects.slice(
                                                page * CARD_LIMIT,
                                                page * CARD_LIMIT + CARD_LIMIT
                                            ).length,
                                    }).map((_, idx) => (
                                        <div
                                            key={`empty-${idx}`}
                                            className={s.todoCardPlaceholder}
                                            onClick={() => {
                                                setViewMode("table");
                                                setShowNewForm(true);
                                            }}
                                        >
                                            <span className={s.plus}>+</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <Button
                            className={s.arrowRight}
                            onClick={() => paginate(1)}
                            disabled={page === maxPage}
                        >
                            <img
                                src={arrowRightSrc}
                                alt="→"
                                className={s.arrowIcon}
                            />
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}


