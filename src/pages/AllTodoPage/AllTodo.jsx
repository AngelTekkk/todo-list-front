import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteTodoMutation, useUpdateStatusTodoMutation } from '../../services/api/todoApi';
import { toggleTodo, getAllTodos, removeTodo } from '../../redux/todos/todoSlice';
import s from "./AllTodo.module.scss"
import Button from "../../components/Button/Button.jsx";
import { updateTodoModal } from "../../redux/dashboard/dashboardSlice.js";
import CustomSelect from "../../components/CustomDropdown/CustomDropdown.jsx";
import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import {getAllProjects} from "../../redux/projects/projectsSlice.js";


function AllTodoPage() {

    const fetchedTodos = useSelector(getAllTodos);
    const dispatch = useDispatch();
    const [updateStatus] = useUpdateStatusTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const projectsFromState = useSelector(getAllProjects);

    const handleSetStatus = async (id, newStatus) => {
        const newStatusObject = {status: newStatus};
        try {
            await updateStatus({newStatusObject, id}).unwrap();
            dispatch(toggleTodo({id, newStatus}));
        } catch (err) {
            console.error("Fehler beim Aktualisieren des ToDos:", err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo(id));
        } catch (err) {
            console.error("Fehler beim Löschen des ToDos:", err);
        }
    };

    const handleOpenModal = (type, todoId = null) => {
        dispatch(updateTodoModal({type, todoId}));
    };

    const getProjectTitle = (projectId) => {
        const project = projectsFromState.find(p => p.id === projectId);
        return project ? project.title : '---';
    }

    const renderTable = (status) => {
        const filteredTodos = fetchedTodos
            .filter((todo) => todo.status === status)
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        return (
            <section className={s.allTodoSection} key={status}>
                <h3 className={s.h3}>{status}</h3>
                {filteredTodos.length === 0 ? (
                    <p className={s.infoP}>Keine ToDos im Status {status}.</p>
                ) : (
                    <table className={s.table}>
                        <thead className={s.allTodoThead} >
                        <tr>
                            <th className={s.allTodoThOptions}></th>
                            <th className={s.allTodoThTitle}>Titel</th>
                            <th className={s.allTodoThDescription}>Beschreibung</th>
                            <th className={s.allTodoThProject}>Projekt</th>
                            <th className={s.allTodoThEndDate}>Fällig am</th>
                            <th className={s.allTodoThStatus}>Status</th>
                        </tr>
                        </thead>
                        <tbody className={s.allTodoTbody}>
                        {filteredTodos.map((todo) => (
                            <tr key={todo.id}>
                                <td className={s.allTodoTd}>

                                    <Button
                                        className={s.updateBtn}
                                        onClick={() => handleOpenModal('updateTodo', todo.id)}
                                        text={'📝'}
                                    />

                                    <Button
                                        className={s.deleteBtn}
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        text={'🗑️'}
                                    />
                                </td>
                                <td className={s.allTodoTd}>{todo.title}</td>
                                <td className={s.allTodoTd}>{todo.description}</td>
                                <td className={s.allTodoTd}>{getProjectTitle(todo.projectId)}</td>
                                <td className={s.allTodoTd}>{todo.endDate}</td>
                                <td className={s.allTodoTd}>
                                    <CustomSelect
                                        value={todo.status}
                                        options={[
                                            { value: "TODO", label: "TODO" },
                                            { value: "DOING", label: "DOING" },
                                            { value: "DONE", label: "DONE" },
                                        ]}
                                        onChange={(newStatus) => handleSetStatus(todo.id, newStatus)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        );
    };

    return (
        <div className={s.wrapper}>
            {['TODO', 'DOING', 'DONE'].map(renderTable)}
            <ModalWindow></ModalWindow>
        </div>
    );
}

export default AllTodoPage;
