import s from "./Container.module.scss"
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";

// function Container(children) {
//     return (
//         <div className={s.container}>
//             <Header />
//             {children}
//             <Footer />
//         </div>
//     )
// };

import { Outlet } from "react-router-dom";

function Container() {
    return (
        <div className={s.container}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Container;