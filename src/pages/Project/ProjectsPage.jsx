// src/pages/Project/ProjectsPage.jsx
import React, { useState, useEffect } from "react";
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "../../services/api/projectApi.js";
import {
    useAssignToProjectMutation,
    useRemoveFromProjectMutation,
    useGetTodosQuery,
} from '../../services/api/todoApi.js';
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

    // Получаем «все todo» для возможности их добавлять в проекты
    const { data: allTodos = [] } = useGetTodosQuery();

    // Этот эндпоинт теперь создаёт/удаляет только связь todo ↔ project (многие‐ко‐многим)
    const [assignToProject, { isLoading: isAssigning, isError: assignError }] =
        useAssignToProjectMutation();
    const [removeFromProject, { isLoading: isRemoving, isError: removeError }] =
        useRemoveFromProjectMutation();

    // UI state
    const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);

    // form fields (новый проект)
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // form fields (редактирование проекта)
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // для добавления/удаления задач при редактировании проекта
    const [addIds, setAddIds] = useState(new Set());
    const [removeIds, setRemoveIds] = useState(new Set());

    // carousel paging
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const maxPage = Math.ceil(projects.length / CARD_LIMIT) - 1;

    // выбранный проект и его локальные задачи
    const selectedProject =
        projects.find((p) => p.id === selectedId) || null;
    const [localTasks, setLocalTasks] = useState([]);

    // при выборе проекта сбрасываем некоторые состояния
    useEffect(() => {
        if (selectedProject) {
            // берем актуальный список задач, привязанных к этому проекту
            setLocalTasks(selectedProject.tasks || []);
            setAddIds(new Set());
            setRemoveIds(new Set());
            setShowNewForm(false);
            setIsEditing(false);

            // поставить карусель на индекс выбранного проекта
            const idx = projects.findIndex((p) => p.id === selectedProject.id);
            if (idx !== -1) {
                setPage(idx);
            }
        }
    }, [selectedProject, projects]);

    // при входе в режим "редактирование" заполняем поля
    useEffect(() => {
        if (isEditing && selectedProject) {
            setEditTitle(selectedProject.title);
            setEditDescription(selectedProject.description);
            setAddIds(new Set());
            setRemoveIds(new Set());
        }
    }, [isEditing, selectedProject]);

    if (isLoadingProjects) return <p>Loading projects…</p>;
    if (isErrorProjects) return <p>Error loading projects</p>;

    // date‐range helpers
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
            // — детальный просмотр: прокрутимся к соседнему проекту
            const currentIndex = projects.findIndex((p) => p.id === selectedId);
            const nextIndex = currentIndex + dir;
            if (nextIndex < 0 || nextIndex >= projects.length) return;
            setDirection(dir);
            setPage(nextIndex);
            setSelectedId(projects[nextIndex].id);
            setIsEditing(false);
        } else {
            // — табличная карусель
            const next = page + dir;
            if (next < 0 || next > maxPage) return;
            setDirection(dir);
            setPage(next);
        }
    };

    // переключение вида (таблица / карточки)
    const toggleView = () =>
        setViewMode((m) => (m === "table" ? "cards" : "table"));

    // create new project
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) return;
        try {
            await createProject({
                title: newTitle.trim(),
                description: newDescription.trim(),
            }).unwrap();
            setShowNewForm(false);
            setNewTitle("");
            setNewDescription("");
            await refetchProjects();
        } catch (err) {
            console.error("Fehler beim Erstellen des Projekts:", err);
        }
    };

    // delete project
    const handleDelete = async (id) => {
        if (!window.confirm("Wollen wir das Projekt wirklich löschen?")) return;
        try {
            await deleteProject(id).unwrap();
            setSelectedId(null);
            await refetchProjects();
        } catch {
            // игнорируем
        }
    };

    // save edits (title/description + задачи)
    const handleSaveProject = async (e) => {
        e.preventDefault();
        try {
            // 1) Обновляем title/description
            await updateProject({ id: selectedProject.id, title: editTitle.trim(), description: editDescription.trim() }).unwrap();

            // 2) Удаляем связи из проекта:
            if (removeIds.size > 0) {
                await Promise.all(
                    Array.from(removeIds).map((todoId) =>
                        removeFromProject({ todoId, projectId: selectedProject.id }).unwrap()
                    )
                );
            }

            // 3) Добавляем задачи в проект:
            if (addIds.size > 0) {
                await Promise.all(
                    Array.from(addIds).map((todoId) =>
                        assignToProject({ todoId, projectId: selectedProject.id }).unwrap()
                    )
                );
            }

            // 4) Сбрасываем стейт и рефетчим
            setRemoveIds(new Set());
            setAddIds(new Set());
            setIsEditing(false);
            await refetchProjects();
        } catch (err) {
            console.error("Ошибка при сохранении проекта:", err);
        }
    };

    // список задач, которые ещё _не_ принадлежат данному проекту
    // (но могут уже находиться в других проектах)
    const available = allTodos.filter(
        (t) => !localTasks.some((x) => x.id === t.id)
    );

    // toggle «добавить» галочку
    const toggleAdd = (id) => {
        setAddIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // toggle «удалить» галочку
    const toggleRemove = (id) => {
        setRemoveIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // === Если выбран отдельный проект ===
    if (selectedProject) {
        const { title, description } = selectedProject;
        const tasks = localTasks;

        // 1) если isEditing === true → показываем модалку с формой редактирования
        if (isEditing) {
            return (
                <div className={s.page}>
                    {/* Фоновая карточка (просто для визуального фона) */}
                    <div className={s.projectCardBackdrop}>
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
                                <p className={s.noTasks}>Keine Aufgaben.</p>
                            )}
                        </div>
                    </div>

                    {/* Модальное окно редактирования */}
                    <div className={s.modalOverlay}>
                        <div className={s.modalContent}>
                            <form onSubmit={handleSaveProject} className={s.editForm}>
                                <h2 className={s.modalTitle}>Projekt bearbeiten</h2>

                                {/* — Редактирование title/description — */}
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
                                        className={s.updateBtn}
                                    >
                                        {isUpdating || isAssigning ? "Bestätigen…" : "Bestätigen"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setRemoveIds(new Set());
                                            setAddIds(new Set());
                                        }}
                                        disabled={isUpdating || isAssigning}
                                        className={s.deleteBtn}
                                    >
                                        Absagen
                                    </button>
                                </div>

                                {(updateError || assignError || removeError) && (
                                    <p className={s.error}>
                                        {updateError
                                            ? "Fehler beim Speichern des Projekts."
                                            : assignError || removeError
                                                ? "Fehler при изменении привязки задач."
                                                : null}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            );
        }

        // 2) isEditing === false → обычный просмотр + карусель
        return (
            <div className={s.page}>
                {/* ← Zurück zu Projekte */}
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
                            disabled={page === 0}
                        >
                            <img src={arrowLeftSrc} alt="←" className={s.arrowIcon} />
                        </Button>

                        <div className={s.projectCard}>
                            {/* — Просмотр мета — */}
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
                                    <p className={s.noTasks}>Keine Aufgaben.</p>
                                )}
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
                        </div>

                        <Button
                            className={s.arrowRight}
                            onClick={() => paginate(1)}
                            disabled={page === projects.length - 1}
                        >
                            <img src={arrowRightSrc} alt="→" className={s.arrowIcon} />
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    // — Список или карусель списка проектов (основной экран) —
    return (
        <div className={s.page}>
            {/* Заголовок */}
            <div className={s.headerRow}>
                <h1 className={s.heading}>Deine Projekte</h1>
            </div>

            {/* Ряд кнопок: слева «Neues Projekt herstellen», справа «Card View / List View» */}
            <div className={s.controlsRow}>
                {/* Слева: кнопка создания проекта */}
                <button className={s.newBtn} onClick={() => setShowNewForm(true)}>
                    Neues Projekt herstellen
                </button>

                {/* Справа: кнопка переключения вида */}
                <button onClick={toggleView} className={s.newBtn}>
                    {viewMode === "table" ? "Card View" : "List View"}
                </button>
            </div>

            {/* --- Модальное окно «Новый проект» --- */}
            {showNewForm && (
                <div className={s.modalOverlay}>
                    <div className={s.modalContent}>
                        <form onSubmit={handleCreate} className={s.newForm}>
                            <h2 className={s.modalTitle}>Neues Projekt erstellen</h2>

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
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className={s.updateBtn}
                                >
                                    {isCreating ? "Bestätigen…" : "Bestätigen"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewForm(false)}
                                    disabled={isCreating}
                                    className={s.deleteBtn}
                                >
                                    Absagen
                                </button>
                            </div>
                            {createError && <p className={s.error}>Fehler beim Erstellen.</p>}
                        </form>
                    </div>
                </div>
            )}

            {viewMode === "table" ? (
                <section className={s.section}>
                    <table className={s.table}>
                        <thead>
                        <tr className={s.theadTr}>
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
            ) : (
                <section className={s.section}>
                    <div className={s.carousel}>
                        <Button
                            className={s.arrowLeft}
                            onClick={() => paginate(-1)}
                            disabled={page === 0}
                        >
                            <img src={arrowLeftSrc} alt="←" className={s.arrowIcon} />
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
                                                    <div className={s.todoTitle}>
                                                        <h4>{p.title}</h4>
                                                    </div>
                                                    <div className={s.cardStuff}>
                                                        <p className={s.beschreibung}>
                                                            <strong>Beschreibung:</strong>
                                                        </p>
                                                        <div className={s.cardBeschreibung}>
                                                            {p.description}
                                                        </div>
                                                        <p className={s.zeitraum}>
                                                            <strong>Zeitraum:</strong>
                                                        </p>
                                                        <div className={s.startDate}>
                                                            {tasks.length ? (
                                                                <>
                                                                    Start:&nbsp;
                                                                    <span>{getEarliest(tasks)}</span>
                                                                </>
                                                            ) : (
                                                                "Start: —"
                                                            )}
                                                        </div>
                                                        <div className={s.endDate}>
                                                            {tasks.length ? (
                                                                <>
                                                                    Ende:&nbsp;
                                                                    <span>{getLatest(tasks)}</span>
                                                                </>
                                                            ) : (
                                                                "Ende: —"
                                                            )}
                                                        </div>
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
                                    {/* placeholders */}
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
                            <img src={arrowRightSrc} alt="→" className={s.arrowIcon} />
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}
