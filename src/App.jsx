import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {RouterProvider} from "react-router-dom";
import router from "./router/router.js";
import {useCheckAuthQuery} from "./services/api/authApi.js";
import {oauth} from "./redux/auth/authSlice.js";
import Loader from "./components/Loader/Loader.jsx";
import {useGetProjectsQuery} from "./services/api/projectApi.js";
import {useGetTodosQuery} from "./services/api/todoApi.js";
import {allTodos} from "./redux/todos/todoSlice.js";
import {allProjects} from "./redux/projects/projectsSlice.js";

function App() {
    const [skip, setSkip] = useState(true);
    const dispatch = useDispatch();
    const {data, isSuccess, isLoading} = useCheckAuthQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    const {data: todos, isSuccess: todosIsSuccess} = useGetTodosQuery(undefined, {
        skip,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    const {data: projects, isSuccess: projectsIsSuccess} = useGetProjectsQuery(undefined, {
        skip,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    useEffect(() => {
        if (isSuccess) {
            dispatch(oauth(data));
            setSkip(false);
        }
    }, [isSuccess, data, dispatch]);

    useEffect(() => {
        if (todosIsSuccess) {
            dispatch(allTodos(todos));
        }
    }, [todosIsSuccess, todos, dispatch]);

    useEffect(() => {
        if (projectsIsSuccess) {
            dispatch(allProjects(projects));
        }
    }, [projectsIsSuccess, projects, dispatch]);

    return (
        <>
            {isLoading
                ?
                <Loader/>
                :
                <RouterProvider router={router}/>
            }
        </>

    )
}

export default App
