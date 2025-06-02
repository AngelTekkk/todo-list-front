import {useDispatch, useSelector} from "react-redux";
import Button from "../../components/Button/Button.jsx";
import s from "./DashboardPage.module.scss";

import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {getIsAuthenticated} from "../../redux/auth/authSlice.js";
import {getAllTodos} from "../../redux/todos/todoSlice.js";
import {getAllProjects} from "../../redux/projects/projectsSlice.js";
import {getCurriculum} from "../../redux/curriculum/curriculumSlice.js";
import TodoWidget from "../../components/DashboardComponents/TodoWidget/TodoWidget.jsx";
import ProjectWidget from "../../components/DashboardComponents/ProjectWidget/ProjectWidget.jsx";
import CurryWidget from "../../components/DashboardComponents/CurryWidget/CurryWidget.jsx";
import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import StatCarousel from "../../components/DashboardComponents/StatisticCarousel/StatisticCarousel.jsx";


function DashboardPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);


    const loadedTodos = useSelector(getAllTodos);
    const loadedProjects = useSelector(getAllProjects);
    const loadedCurry = useSelector(getCurriculum);

    const nextTodos = loadedTodos
        .filter(todo => todo.endDate && todo.status !== "done")
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 3);

    // function safeFormatDate(dateString, formatString) {
    //     const date = new Date(dateString);
    //     return !isNaN(date) ? format(date, formatString) : "Ungültiges Datum";
    // }
    //
    // const nextDeadlineFormatted = nextTodos.length > 0
    //     ? safeFormatDate(nextTodos[0].endDate, "dd.MM.yyyy")
    //     : "Keine offenen Aufgaben";

    const handleOpenModal = (type) => {
        dispatch(openModal({type})); // 'login' oder 'register'
    }

    return (
        <>
            <div className={s.bigContainer}>
                <h1 className={s.title}>Willkommen zu unserer krassen TODO-App</h1>
                {!isAuthenticated &&
                    <div className={s.beforeLogin}>
                        <div className={s.authContainer}>
                            <Button onClick={() => handleOpenModal('login')} text={'Anmelden'}/>
                            <Button onClick={() => handleOpenModal('register')} text={'Registrieren'}/>
                        </div>
                        <div className={s.infos}>
                            <div className={s.redInfo}>
                                <p>⭕ Plane deine Aufgaben</p>
                            </div>
                            <div className={s.yellowInfo}>
                                <p>⭕ Erstelle eigene Projekte</p>
                            </div>
                            <div className={s.greenInfo}>
                                <p>⭕ Erstelle deinen persönlichen Lernplan </p>
                                <p>⭕ Behalte deinen Lernfortschritt im Blick</p>
                            </div>
                        </div>
                    </div>
                }
                {isAuthenticated && <div className={s.todoPartWrapper}>
                    <div className={s.statCarousel}>
                        <StatCarousel/>
                    </div>
                    <div className={s.nextTodoSection}>
                        <h2 className={s.dashboardH2}>deine nächsten Todos</h2>
                        {nextTodos.map(todo => (
                            <TodoWidget key={todo.id} todo={todo}/>
                        ))}
                    </div>
                    <div className={s.projectSection}>
                        <h2 className={s.dashboardH2}>Projekt-Status</h2>
                        {loadedProjects.slice(0, 3).map(project => (
                            <ProjectWidget key={project.id} project={project}/>
                        ))}
                    </div>
                    <div className={s.currySection}>
                        <h2 className={s.dashboardH2}>Dein Curry</h2>
                        <CurryWidget plan={loadedCurry}/>
                    </div>
                </div>}
                <ModalWindow></ModalWindow>
            </div>
        </>
    )
}

export default DashboardPage;