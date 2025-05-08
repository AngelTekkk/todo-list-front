import React from "react";
import s from "./Footer.module.scss";


function Footer() {

    return (
        <footer className={s.footer}>
            <div className={s.footerStuff}>
                <div>
                    <a className={s.a} href="/">H🥚ME</a>
                    <a className={s.a} href="#">JOBS</a>
                    <a className={s.a} href="#">IMPRESSUM</a>
                    <a className={s.a} href="https://www.google.com/maps/place/Vegreville+Pysanka/@53.4915906,-112.0369078,177m/data=!3m1!1e3!4m6!3m5!1s0x53a09c3774d43ecd:0x7bfe313dc03949ed!8m2!3d53.491703!4d-112.0365014!16s%2Fm%2F09k6fc8?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">EI</a>
                </div>
                <>
                    <p className={s.p}>© 2025 ToDo's by Eierlikörkuchen 🥚🍸🍰. All rights reserved.</p>
                </>
            </div>
        </footer>
    );
}
export default Footer;