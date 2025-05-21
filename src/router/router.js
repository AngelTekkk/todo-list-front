import {createBrowserRouter} from "react-router-dom";

import TodoPage from "../pages/todo/TodoPage.jsx";
import NewToDo from "../components/NewToDo/NewToDo.jsx";
import ProjectsPage from "../pages/Project/ProjectsPage.jsx";
import UpdateTodoPage from "../components/UpdateToDo/UpdateTodoPage.jsx";
import AllTodo from "../pages/AllTodoPage/AllTodo.jsx";
import Container from "../components/Container/Container.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import CurriculumPage from "../pages/AllCurriculumPage/CurriculumPage.jsx";

const router = createBrowserRouter([


    {
        path: "/",
        Component: Container,
        children: [
            { index: true, Component: DashboardPage },
            { path: "todos", Component: TodoPage },
            { path: "createNewTodo", Component: NewToDo },
            { path: "projects", Component: ProjectsPage },
            { path: "updateToDo/:id", Component: UpdateTodoPage },
            { path: "allTodos", Component: AllTodo },
            { path: "curriculum", Component: CurriculumPage}
        ]
    },

    // {
    //     path: "/",
    //     Component: <Container><DashboardPage/></Container>,
        // children: [
        // { index: true, Component: Home },
        // { index: true, Component: Header },
        // {
        //     path: "auth",
        //     Component: AuthLayout,
        //     children: [
        //         { path: "login", Component: Login },
        //         { path: "register", Component: Register },
        //     ],
        // },
        // {
        //     path: "concerts",
        //     children: [
        //         { index: true, Component: ConcertsHome },
        //         { path: ":city", Component: ConcertsCity },
        //         { path: "trending", Component: ConcertsTrending },
        //     ],
        // },
        // ],
    // },

    // {
    //     path: "/todos",
    //     Component: Container(<TodoPage/>)
    // },
    // {
    //     path: "/createNewTodo",
    //     Component: NewToDo
    // },
    // {
    //     path: "/projects",
    //     Component: ProjectsPage
    // },
    // {
    //     path: "/updateToDo/:id",
    //     Component: UpdateTodoPage
    // },
    // {
    //     path: "/allTodos",
    //     Component: AllTodo
    // },
]);

export default router;
