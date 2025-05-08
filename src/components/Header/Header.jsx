import React from "react";
import s from "./Header.module.scss";


function Header() {

    const handleLogout = () => {
        window.alert("Willst du dich wirklich ausloggen?");
        const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid tomato; font-size: 5em;'
        console.log("%cCiao Kakao", style)
    };
    return (
        <header className={s.header}>
            <h1 className={s.h1}><a className="h1-link" href="https://www.youtube.com/watch?v=pOWCtIv9LK8" target="_blank" rel="noopener noreferrer">🥚🍷🍰 ToDo's</a></h1>
            <nav>
                <ul className={s.navList}>
                    <li className={s.navPoint}><a className={s.navLink} href='#'>MY TODO'S</a></li>
                    <li className={s.navPoint}><a className={s.navLink} href='#'>PROJECTS</a></li>
                    <li className={s.navPoint}><a className={s.navLink} href='#'>CURRICULUM</a></li>
                    <li className={s.navPoint}><a className={s.navLink} href='#'>COMPLETED</a></li>
                </ul>
            </nav>
                <button className={s.logoutBtn} onClick={handleLogout}>LOGOUT</button>
        </header>
    );
}

export default Header;