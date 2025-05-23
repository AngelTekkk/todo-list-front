import {useDispatch, useSelector} from "react-redux";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";
import {getAllTodos} from "../../redux/todos/todoSlice.js";
import {getAllProjects, setProjects} from "../../redux/projects/projectsSlice.js";
import {useEffect} from "react";
import {useGetProjectsQuery} from "../../services/api/projectApi.js";
import s from './ShowTodo.module.scss'



function ShowTodo() {
    const id = useSelector(getTodoId);
    const todos = useSelector(getAllTodos);
    const todo = todos.find(t => t.id === id);
    const { data: projects, isLoading: isLoadingProjects } = useGetProjectsQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if(!isLoadingProjects && projects){
            dispatch(setProjects(projects));
        }
    }, [dispatch, isLoadingProjects, projects]);

    // const allProjectsInState = useSelector((state)=>state.projects.projects);
    const allProjectsInState = useSelector(getAllProjects);
    const currentProject = allProjectsInState?.find(p => p.id === todo?.projectId);

    return (
        <div className={s.todoContainer}>
            <div className={s.todoCard}>
                <h2 className={`${s.todoTitle} ${s.rainbowText}`}>{todo.title}</h2>
                <p className={`${s.todoDesc} ${s.glowText}`}>{todo.description}</p>
                <p><strong>Start:</strong> {todo.startDate}</p>
                <p><strong>Ende:</strong> {todo.endDate}</p>
                <p><strong>Projekt:</strong> {currentProject?.title || "Kein Preeejekt"}</p>
                <p><strong>Status:</strong> {todo.status}</p>
            </div>
        </div>
    );

}

export default ShowTodo;