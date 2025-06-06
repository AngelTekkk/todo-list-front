import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";
import TodoPage from "../pages/todo/TodoPage.jsx";
import NewToDo from "../components/NewToDo/NewToDo.jsx";
import ProjectsPage from "../pages/Project/ProjectsPage.jsx";
import UpdateTodoPage from "../components/UpdateToDo/UpdateTodoPage.jsx";
import AllTodo from "../pages/TodoCalendar/TodoCalendar.jsx";
import CurriculumPage from "../pages/AllCurriculumPage/CurriculumPage.jsx";
import TodoCalendar from "../pages/TodoCalendar/TodoCalendar.jsx";

export const ProtectedTodoPage = () => (
    <ProtectedRoute>
        <TodoPage />
    </ProtectedRoute>
);

export const ProtectedNewToDo = () => (
    <ProtectedRoute>
        <NewToDo />
    </ProtectedRoute>
);

export const ProtectedProjectsPage = () => (
    <ProtectedRoute>
        <ProjectsPage />
    </ProtectedRoute>
);

export const ProtectedUpdateTodoPage = () => (
    <ProtectedRoute>
        <UpdateTodoPage />
    </ProtectedRoute>
);

export const ProtectedTodoCalendar = () => (
    <ProtectedRoute>
        <TodoCalendar />
    </ProtectedRoute>
);

export const ProtectedCurriculumPage = () => (
    <ProtectedRoute>
        <CurriculumPage />
    </ProtectedRoute>
);