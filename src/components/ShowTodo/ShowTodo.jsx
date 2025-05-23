import {useDispatch, useSelector} from "react-redux";
import {getTodoId} from "../../redux/dashboard/dashboardSlice.js";
import {getAllTodos} from "../../redux/todos/todoSlice.js";
import {getAllProjects, setProjects} from "../../redux/projects/projectsSlice.js";
import {useEffect} from "react";
import {useGetProjectsQuery} from "../../services/api/projectApi.js";



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
        <div>
            <p>Name: {todo.title}</p>
            <p>Beschreibung: {todo.description}</p>
            <p>Start: {todo.startDate}</p>
            <p>Ende: {todo.endDate}</p>
            <p>Projekt: {currentProject?.title || "Kein Preeejekt"}</p>
            <p>Status: {todo.status}</p>
        </div>
    )
}

export default ShowTodo;