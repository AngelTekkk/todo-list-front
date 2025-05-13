import {useDispatch, useSelector} from "react-redux";

import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import Button from "../../components/Button/Button.jsx";
import s from "./DashboardPage.module.scss";

import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {getIsAuthenticated} from "../../redux/auth/authSlice.js";
import { useTestQuery, useTestPostMutation} from "../../services/api/authApi.js"; // Should be deleted. For test

function DashboardPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(getIsAuthenticated);
    console.log("isAuthenticated: " + isAuthenticated)

    // Should be deleted. For test
    const { data: testData } = useTestQuery(undefined, {skip: !isAuthenticated});
    const [testPost] = useTestPostMutation();
    const handleTest = async () => {
        if (!isAuthenticated) {
            alert("Zuerst anmelden");
            dispatch(openModal('login'));
            return;
        }

        try {
            console.log(testData);
        } catch (e) {
            console.error(e?.message)
        }
    }
    const handleTestPost = async () => {
        const payload = {
            title: "TestPost",
            description: "TestPOST",
            endDate: "2025-05-30",
            startDate: "2025-05-20",
            status: "DOING",
            projectId: null,
            curriculumIds: null
        }
        try {
            const res = await testPost(payload).unwrap();
            console.log(res);
        } catch (e) {
            console.error(e.message)
        }
    }

    const handleOpenModal = (type) => {
        dispatch(openModal(type)); // 'login' oder 'register'
    }

    return (
        <>
            <div className={s.bigContainer}>
                <h1 className={s.h1}>Hallo</h1>
                {!isAuthenticated &&
                    <>
                        <Button onClick={() => handleOpenModal('login')} text={'Anmelden'}/>
                        <Button onClick={() => handleOpenModal('register')} text={'Registrieren'}/>
                    </>
                }
                <Button onClick={handleTest} text={'test'} />
                <Button onClick={handleTestPost} text={'testPost'} />

                <ModalWindow></ModalWindow>
            </div>
        </>
    )
}

export default DashboardPage;