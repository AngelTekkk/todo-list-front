import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import {useDispatch} from "react-redux";

import {useTestMutation, useTestPostMutation} from "../../services/api/authApi.js"; // Should be deleted. For test

function DashboardPage() {
    const dispatch = useDispatch();

    // Should be deleted. For test
    const [test] = useTestMutation();
    const [testPost] = useTestPostMutation();
    const handleTest = async () => {
        try {
            const res = await test().unwrap();
            console.log(res);
        } catch (e) {
            console.error(e.message)
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
        dispatch(openModal(type)); // 'login' или 'register'
    }

    return (
        <>
            <h1>Hallo</h1>
            <button onClick={() => handleOpenModal('login')}>Anmelden</button>
            <button onClick={() => handleOpenModal('register')}>Registrieren</button>
            <button onClick={handleTest}>test</button>
            <button onClick={handleTestPost}>testPost</button>
            <ModalWindow></ModalWindow>
        </>
    )
}

export default DashboardPage;