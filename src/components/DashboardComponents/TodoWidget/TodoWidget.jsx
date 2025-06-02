import React from "react";
import s from "./TodoWidget.module.scss";
import { format } from "date-fns";
import {useSelector} from "react-redux";
import {getAllProjects} from "../../../redux/projects/projectsSlice.js";
import {CheckCircle, Clock, Circle} from "lucide-react";

function TodoWidget({ todo }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "DONE":
                return <CheckCircle className={`${s.icon} ${s.done}`} />;
            case "DOING":
                return <Clock className={`${s.icon} ${s.doing}`} />;
            default:
                return <Circle className={`${s.icon} ${s.todo}`} />;
        }
    };

    const projects = useSelector(getAllProjects);

    const todoProjectTitle = () => {
        const projectId = todo.projectId;
        const project = projects?.find(p => p.id === projectId);
        return project ? project.title : "Kein Projekt";
    }


    return (
        <div className={s.card}>
            <div className={s.header}>
                {getStatusIcon(todo.status)}
                <h3>{todo.title}</h3>
            </div>
            <p className={s.description}>{todo.description}</p>
            <div className={s.footer}>
                <span className={s.project}>{todoProjectTitle()}</span>
                <span className={s.deadline}>
                    Fällig am: {format(new Date(todo.endDate), "dd.MM.yyyy")}
                </span>
            </div>
        </div>
    );
}

export default TodoWidget;
