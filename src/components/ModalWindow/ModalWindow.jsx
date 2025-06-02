import ReactModal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";
import {getModalType, closeModal} from "../../redux/dashboard/dashboardSlice.js";
import {useEffect} from "react";

import AuthForm from "../AuthForm/AuthForm.jsx"
import Button from "../Button/Button.jsx";
import s from "./ModalWindow.module.scss"
import NewToDo from "../NewToDo/NewToDo.jsx";
import UpdateTodoPage from "../UpdateToDo/UpdateTodoPage.jsx";
import ShowTodo from "../ShowTodo/ShowTodo.jsx";

const customStyles = {
    content: {
        borderRadius: '15px',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.7)',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'black',
        overflow: 'visible'
    },
};

function ModalWindow() {
    const modalType = useSelector(getModalType);
    const dispatch = useDispatch();

    useEffect(() => {
        ReactModal.setAppElement('#root');
    }, []);

    const handleClose = () => {
        dispatch(closeModal());
    }

    return (
        <ReactModal isOpen={modalType !== null} onRequestClose={handleClose} style={customStyles}>
            <Button onClick={handleClose} text={'X'} className={s.closeBtn}/>
            {modalType === 'login' && <AuthForm type={modalType} onSuccess={handleClose}/>}
            {modalType === 'register' && <AuthForm type={modalType} onSuccess={handleClose}/>}
            {modalType === 'newTodo' && <NewToDo type={modalType} onSuccess={handleClose}/>}
            {modalType === 'updateTodo' && <UpdateTodoPage type={modalType} onSuccess={handleClose} />}
            {modalType === 'showTodo' && <ShowTodo type={modalType} onSuccess={handleClose}/>}
        </ReactModal>
    )
}

export default ModalWindow;