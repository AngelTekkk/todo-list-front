import api from "./axios";

// Alle Projekte erhalten
export const fetchProjects = () => api.get("/todo-list-api/projects");

// Ein Projekt erstellen
export const createProject = (projectData) =>
    api.post("/todo-list-api/projects", projectData);

// Projekt nach ID aktualisieren
export const updateProject = (id, projectData) =>
    api.patch(`/todo-list-api/projects/${id}`, projectData);

// Projekt nach ID löschen
export const deleteProject = (id) =>
    api.delete(`/todo-list-api/projects/${id}`);