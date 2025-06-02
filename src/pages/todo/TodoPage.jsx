import React from 'react';
import {useDeleteTodoMutation, useUpdateStatusTodoMutation} from '../../services/api/todoApi';
import s from './TodoPage.module.scss';
import {NavLink,
    // useNavigate
} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getAllTodos, removeTodo, toggleTodo} from "../../redux/todos/todoSlice.js";
import ToDoSection from "./TodoSection/TodoSection.jsx";
import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import Button from "../../components/Button/Button.jsx";
import {openModal} from "../../redux/dashboard/dashboardSlice.js";

function TodoPage() {
    const [deleteTodo] = useDeleteTodoMutation();
    const [updateStatus] = useUpdateStatusTodoMutation();
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchedTodos = useSelector(getAllTodos);

    const handleSetStatus = async (id, newStatus) => {
        const newStatusObject = {status: newStatus};
        try {
            await updateStatus({newStatusObject, id}).unwrap();
            dispatch(toggleTodo({id, newStatus}));
        } catch (err) {
            console.error("Fehler beim Aktualisieren des ToDos:", err);
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        const nextStatus =
            currentStatus === 'TODO' ? 'DOING' :
                currentStatus === 'DOING' ? 'DONE' :
                    'TODO';
         return handleSetStatus(id, nextStatus);
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo(id));
            console.log("Dein Todo isch im eimer")
        } catch (err) {
            console.error("Fehler beim Löschen des ToDos:", err);
        }
    };

    const handleOpenModal = (type) => {
        dispatch(openModal({type}));
    }

    return (
        <div className={s.todoList}>
            <div className={s.leftSide}>
                <Button className={s.openNewTodoForm} onClick={() => handleOpenModal('newTodo')} text={'neues Todo'}/>
            </div>
            <div className={s.todoSections}>
                {["TODO", "DOING", "DONE"].map((status) => (
                    <ToDoSection
                        key={status}
                        status={status}
                        todos={fetchedTodos.filter(todo => todo.status === status)}
                        onSetStatus={handleSetStatus}
                        onToggleStatus={handleToggleStatus}
                        onDeleteTodo={handleDeleteTodo}
                        onUpdateTodo={() => handleOpenModal('updateTodo')}
                    />
                ))}
            </div>
            <div className={s.rightSide}></div>
            <ModalWindow></ModalWindow>
        </div>
    );
}

export default TodoPage;