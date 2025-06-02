import s from "./ProjectWidget.module.scss";

function ProjectWidget({ project }) {
    return (
        <div className={s.card}>
            <div className={s.details}>
                <h3 className={s.name}>{project.name}</h3>
                <p>Titel: {project.title}</p>
                <p>Todos: {project.tasks?.length ?? 0}</p>
                {/*WARUM HEIßEN DIE TODOS HIER TASKS ???*/}
            </div>
        </div>
    );
}

export default ProjectWidget;
