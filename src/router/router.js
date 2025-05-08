import { createBrowserRouter } from "react-router";

import DashbordPage from "../pages/dashboard/DashboardPage.jsx"
import ProjectsPage from "../pages/Project/ProjectsPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: DashbordPage
        // children: [
        //     { index: true, Component: Home },
        //     { path: "about", Component: About },
        //     {
        //         path: "auth",
        //         Component: AuthLayout,
        //         children: [
        //             { path: "login", Component: Login },
        //             { path: "register", Component: Register },
        //         ],
        //     },
        //     {
        //         path: "concerts",
        //         children: [
        //             { index: true, Component: ConcertsHome },
        //             { path: ":city", Component: ConcertsCity },
        //             { path: "trending", Component: ConcertsTrending },
        //         ],
        //     },
        // ],
    },
    {
        path: "/todo-list-api/projects",
        Component: ProjectsPage
    }
]);

export  default router;
