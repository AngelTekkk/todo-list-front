import React from "react";
import {useNavigate} from "react-router-dom";

import s from "./Footer.module.scss";
import Button from "../Button/Button.jsx";


function Footer() {
    const navigator = useNavigate();

    const handleClick = (path) => {
        navigator(path);
    }

    return (
        <footer className={s.footer}>
            <ul className={s.linkList}>
                <li>
                    <Button className={s.a} onClick={() => handleClick('/')}>H🥚ME</Button>
                </li>
                <li>
                    <Button className={s.a}>JOBS</Button>
                </li>
                <li>
                    <Button className={s.a}>IMPRESSUM</Button>
                </li>
                <li>
                    <a className={s.a}
                       href="https://www.google.com/maps/place/Vegreville+Pysanka/@53.4915906,-112.0369078,177m/data=!3m1!1e3!4m6!3m5!1s0x53a09c3774d43ecd:0x7bfe313dc03949ed!8m2!3d53.491703!4d-112.0365014!16s%2Fm%2F09k6fc8?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                       target="_blank" rel="noopener noreferrer">EI</a>
                </li>
            </ul>
            <p className={s.p}>© 2025 ToDo's by Eierlikörkuchen 🥚🍸🍰. All rights reserved.</p>
        </footer>
    );
}

export default Footer;