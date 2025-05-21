import {useDispatch, useSelector} from "react-redux";

import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import Button from "../../components/Button/Button.jsx";
import s from "./DashboardPage.module.scss";

import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {getIsAuthenticated} from "../../redux/auth/authSlice.js";

function DashboardPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);

    const handleOpenModal = (type) => {
        dispatch(openModal(type)); // 'login' oder 'register'
    }

    return (
        <>
            <div className={s.bigContainer}>
                <h1 className={s.title}>Wilkommen zu unserer krassen TODO-App</h1>
                {!isAuthenticated &&
                    <div className={s.authContainer}>
                        <Button onClick={() => handleOpenModal('login')} text={'Anmelden'}/>
                        <Button onClick={() => handleOpenModal('register')} text={'Registrieren'}/>
                    </div>
                }
                <ModalWindow></ModalWindow>
            </div>
        </>
    )
}

export default DashboardPage;