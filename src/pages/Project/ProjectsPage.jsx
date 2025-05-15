// src/pages/Project/ProjectsPage.jsx
import React, { useState } from "react";
import { useGetProjectsQuery } from "../../services/api/projectApi.js";
import s from "./ProjectsPage.module.scss";

export default function ProjectsPage() {
    // 1) Тянем сразу полный список: у каждого проекта уже есть поле .tasks
    const { data: projects = [], isLoading, isError } = useGetProjectsQuery();
    const [selectedId, setSelectedId] = useState(null);

    if (isLoading) return <p>Loading projects…</p>;
    if (isError)   return <p>Error loading projects</p>;

    // Выбранный объект
    const project = projects.find((p) => p.id === selectedId);

    // Хелперы для периода
    const getEarliest = (tasks) =>
        tasks.length
            ? tasks.reduce(
                (min, t) => (t.startDate < min ? t.startDate : min),
                tasks[0].startDate
            )
            : "";
    const getLatest = (tasks) =>
        tasks.length
            ? tasks.reduce(
                (max, t) => (t.endDate > max ? t.endDate : max),
                tasks[0].endDate
            )
            : "";

    // — Если выбрали проект — показываем только карточку + кнопку назад
    if (project) {
        const { title, description, tasks = [] } = project;

        return (
            <div className={s.page}>
                <button
                    className={s.backBtn}
                    onClick={() => setSelectedId(null)}
                >
                    ← Zurück zur Projekte
                </button>

                <div className={s.card}>
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
                    </div>
                </div>
            </div>
        );
    }

    // — Иначе — общий список проектов
    return (
        <div className={s.page}>
            <h1 className={s.heading}>Deine Projekte</h1>

            {projects.length === 0 ? (
                <p className={s.noProjects}>
                    Sie haben noch keine Projekte.
                </p>
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
                            onClick={() => setSelectedId(p.id)}
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

