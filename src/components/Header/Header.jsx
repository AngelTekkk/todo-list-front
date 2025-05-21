import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import s from "./Header.module.scss";
import Button from "../Button/Button.jsx";
import {getIsAuthenticated, logout as logoutAction} from "../../redux/auth/authSlice.js";
import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {useLogoutMutation} from "../../services/api/authApi.js";


function Header() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const navigator = useNavigate();
    const [logout] = useLogoutMutation();

    const handleOpenModal = (type) => {
        dispatch(openModal(type));
    }

    const handleLogout = async () => {
        window.confirm("Willst du dich wirklich ausloggen?");
        try {
            const resp = await logout().unwrap();
            console.log(resp)
        } catch (err) {
            console.error("Fehler beim Abmelden:", err);
        }
        dispatch(logoutAction());
        const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid tomato; font-size: 5em;';
        console.log("%cCiao Kakao", style);
    };

    const handleNavigation = (path) => {
        navigator(path);
    }

    return (
        <header className={s.header}>
            <h1 className={s.h1}><a className="h1-link" href="https://www.youtube.com/watch?v=pOWCtIv9LK8"
                                    target="_blank" rel="noopener noreferrer">🥚🍷🍰 ToDo's</a></h1>
            {isAuthenticated ?
                <>
                    <nav>
                        <ul className={s.navList}>
                            {location.pathname !== '/todos' && (
                                <li className={s.navPoint}>
                                    <Button onClick={() => handleNavigation('/todos')} text={"MY TODO'S"}/>
                                </li>
                            )}
                            {location.pathname !== '/projects' && (
                                <li className={s.navPoint}>
                                    <Button onClick={() => handleNavigation('/projects')} text={'PROJECTS'}/>
                                </li>
                            )}
                            {location.pathname !== '/curriculum' && (
                                <li className={s.navPoint}>
                                    <Button onClick={() => handleNavigation('/curriculum')} text={'CURRICULUM'}/>
                                </li>
                            )}
                            {location.pathname !== '/completed' && (
                                <li className={s.navPoint}>
                                    <Button onClick={() => handleNavigation('/completed')} text={'COMPLETED'}/>
                                </li>
                            )}
                        </ul>
                    </nav>
                    <Button className={s.logoutBtn} onClick={handleLogout} text={"Abmelden"}/>
                </> :
                <div className={s.navList}>
                    <Button onClick={() => handleOpenModal('login')} text={'Anmelden'}/>
                    <Button onClick={() => handleOpenModal('register')} text={'Registrieren'}/>
                </div>
            }
        </header>
    )
        ;
}

export default Header;