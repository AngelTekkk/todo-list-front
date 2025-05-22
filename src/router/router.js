import {createBrowserRouter} from "react-router-dom";

import Container from "../components/Container/Container.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import {
    ProtectedTodoPage,
    ProtectedNewToDo,
    ProtectedProjectsPage,
    ProtectedUpdateTodoPage,
    ProtectedAllTodo,
    ProtectedCurriculumPage
} from "./protectedRouteWrappers.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Container,

        children: [
            {
                index: true,
                Component: DashboardPage
            },
            {
                path: "todos",
                Component: ProtectedTodoPage
            },
            {
                path: "createNewTodo",
                Component: ProtectedNewToDo
            },
            {
                path: "projects",
                Component: ProtectedProjectsPage
            },
            {
                path: "updateToDo/:id",
                Component: ProtectedUpdateTodoPage
            },
            {
                path: "allTodos",
                Component: ProtectedAllTodo
            },
            {
                path: "curriculum",
                Component: ProtectedCurriculumPage
            }
        ]
    },
]);

export default router;
