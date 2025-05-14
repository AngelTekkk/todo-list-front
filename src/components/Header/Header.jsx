import React from "react";

import {useDispatch, useSelector} from "react-redux";

import s from "./Header.module.scss";
import Button from "../Button/Button.jsx";
import {getIsAuthenticated, logout} from "../../redux/auth/authSlice.js";




function Header() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);



    const handleLogout = () => {
        window.confirm("Willst du dich wirklich ausloggen?");
        dispatch(logout());
        const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid tomato; font-size: 5em;';
        console.log("%cCiao Kakao", style);
    };

    return (
        <header className={s.header}>
            <h1 className={s.h1}><a className="h1-link" href="https://www.youtube.com/watch?v=pOWCtIv9LK8"
                                    target="_blank" rel="noopener noreferrer">🥚🍷🍰 ToDo's</a></h1>
            <nav>
                <ul className={s.navList}>
                    {location.pathname !== '/todos' && (<li className={s.navPoint}><a className={s.navLink} href='/todos'>MY TODO'S</a></li>)}
                    {location.pathname !== '/projects' && (<li className={s.navPoint}><a className={s.navLink} href='/projects'>PROJECTS</a></li>)}
                    {location.pathname !== '/curriculum' && (<li className={s.navPoint}><a className={s.navLink} href='/curriculum'>CURRICULUM</a></li>)}
                    {location.pathname !== '/completed' && (<li className={s.navPoint}><a className={s.navLink} href='/completed'>COMPLETED</a></li>)}

                </ul>
            </nav>
            {isAuthenticated && <Button className={s.logoutBtn} onClick={handleLogout} text={"Abmelden"}/>}
        </header>
    );
}

export default Header;