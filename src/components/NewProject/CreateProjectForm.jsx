// src/components/Project/CreateProjectForm.jsx
import React, { useState } from "react";
import { useCreateProjectMutation } from "../../services/api/projectApi.js";

export default function CreateProjectForm({ onSuccess, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [createProject, { isLoading, isError }] = useCreateProjectMutation();

    const canSave = Boolean(title.trim()) && Boolean(description.trim()) && !isLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSave) return;
        try {
            await createProject({ title: title.trim(), description: description.trim() }).unwrap();
            setTitle("");
            setDescription("");
            onSuccess?.();
        } catch (err) {
            console.error("Create failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: "1em 0" }}>
            <input
                type="text"
                placeholder="Projekt-Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
            />
            <br />
            <textarea
                placeholder="Projekt-Beschreibung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
            />
            <br />
            <button type="submit" disabled={!canSave}>
                {isLoading ? "Erstelle…" : "Create Project"}
            </button>
            <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
                Abbrechen
            </button>
            {isError && <p style={{ color: "red" }}>Fehler beim Erstellen</p>}
        </form>
    );
}
