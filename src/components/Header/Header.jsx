import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, NavLink, useLocation} from "react-router-dom";

import s from "./Header.module.scss";
import Button from "../Button/Button.jsx";
import {getIsAuthenticated} from "../../redux/auth/authSlice.js";
import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {useLogoutMutation} from "../../services/api/authApi.js";


function Header() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [logout] = useLogoutMutation();
    const location = useLocation();


    const navLinks = [
        {path: '/', label: 'DASHBOARD'},
        {path: '/todos', label: 'MY TODOS'},
        {path: '/todoCalendar', label: 'KALENDER'},
        {path: '/projects', label: 'PROJECTS'},
        {path: '/curriculum', label: 'CURRICULUM'},
        {path: '/completed', label: 'COMPLETED'},

    ];


    const handleOpenModal = (type) => {
        dispatch(openModal(type));
    }

    const handleLogout = async (e) => {
        e.preventDefault();

        const isLogout = window.confirm("Willst du dich wirklich ausloggen?");
        if (isLogout) {
            try {
                const resp = await logout().unwrap();
                console.log(resp);

                window.history.replaceState(null, null, '/');
                window.location.reload();
            } catch (err) {
                console.error("Fehler beim Abmelden:", err);
            }
            const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid tomato; font-size: 5em;';
            console.log("%cCiao Kakao", style);
        }
    };

    return (
        <header className={s.header}>
            <h1 className={s.title}><a className="h1-link" href="https://www.youtube.com/watch?v=pOWCtIv9LK8"
                                    target="_blank" rel="noopener noreferrer">🥚🍷🍰 ToDo's</a></h1>
            {isAuthenticated ?
                <>
                    <nav>
                        <ul className={s.navList}>
                            {navLinks
                                .filter(link => location.pathname !== link.path)
                                .map(link => (
                                    <li key={link.path}>
                                        <NavLink className={s.navLink} to={link.path}>
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                        </ul>
                    </nav>
                    <Link className={s.headerLink} onClick={handleLogout} to={'/'}>Abmelden</Link>
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