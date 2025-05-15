import React, {useEffect} from 'react';
import {useDeleteTodoMutation, useGetTodosQuery, useUpdateStatusTodoMutation} from '../../services/api/todoApi';
import s from './TodoPage.module.scss';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {allTodos, getAllTodos, removeTodo, toggleTodo} from "../../redux/todos/todoSlice.js";
import ToDoSection from "./TodoSection/TodoSection.jsx";
import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import {openModal} from "../../redux/dashboard/dashboardSlice.js";
import Button from "../../components/Button/Button.jsx";

function TodoPage() {
    const {data: todos, error, isLoading} = useGetTodosQuery();
    const [deleteTodo] = useDeleteTodoMutation();
    const [updateStatus] = useUpdateStatusTodoMutation();
    const navigate = useNavigate();
    // const location = useLocation();
    const dispatch = useDispatch();
    // dispatch(allTodos(todos))

    useEffect(() => {
        if (!isLoading) {
            dispatch(allTodos(todos));
        }
    }, [dispatch, todos, isLoading]);


    // useEffect(() => {
    //     refetch();
    // }, [location.key, refetch]);

    const fetchedTodos = useSelector(getAllTodos);

    if (isLoading) return <p>Lade Todos…</p>;
    if (error) return <p>Fehler beim Laden der Todos: {error.message}</p>;

    // const handleToggleStatus = async (id, status) => {
    //     const newStatus = status === 'TODO' ? 'DOING' : status === 'DOING' ? 'DONE' : 'TODO';
    //     const newStatusObject = {status: newStatus};
    //     try {
    //         await updateStatus({newStatusObject, id}).unwrap();
    //         dispatch(toggleTodo({id, newStatus}));
    //     } catch (err) {
    //         console.error("Fehler beim Aktualisieren des ToDos:", err);
    //     }
    // };

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

        handleSetStatus(id, nextStatus);
    };


    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id).unwrap();
            dispatch(removeTodo(id));
        } catch (err) {
            console.error("Fehler beim Löschen des ToDos:", err);
        }
    };

    const handleOpenModal = (type) => {
        dispatch(openModal(type));
    }

    return (
        <div className={s.todoList}>

            <h2>Deine ToDos</h2>


            <Button className={s.goToNewToDo} onClick={() => handleOpenModal('newTodo')}
                    text={'Ein neues ToDo erstellen ➡️'}/>

            <a className={s.goToAllTodos} href="/AllTodo">Alle meine TODO's ➡️</a>

            <div className={s.todoSections}>
                {["TODO", "DOING", "DONE"].map((status) => (
                    <ToDoSection
                        key={status}
                        status={status}
                        todos={fetchedTodos.filter(todo => todo.status === status)}
                        onSetStatus={handleSetStatus}
                        onToggleStatus={handleToggleStatus}
                        onDeleteTodo={handleDeleteTodo}
                        onNavigate={(id) => navigate(`/edit/${id}`)}
                    />

                ))}
            </div>

            <ModalWindow></ModalWindow>

        </div>
    );


    // return (
    //     <div className={s.todoList}>
    //         <h2>Deine ToDos</h2>
    //
    //         <a className={s.goToNewToDo} type="button" href="/createNewTodo">
    //             Ein neues ToDo erstellen ➡️
    //         </a>
    //
    //         <div className={s.todoCards}>
    //             {[...fetchedTodos]
    //                 .sort((a, b) => new Date(a.endDate) - new Date(b.endDate)).map((todo) => (
    //                 <div key={todo.id} className={s.todoCard}>
    //
    //                     <Button className={s.fancyStatus} onClick={() => handleToggleStatus(todo.id, todo.status)} text={todo.status} />
    //
    //                     <h3 className={s.todoTitle}>{todo.title}</h3>
    //                     <p className={s.endDate}><strong>Fällig am:</strong> {todo.endDate}</p>
    //
    //                     <p className={s.hidden}><strong>Erstellt von:</strong> {todo.creator}</p>
    //                     <p className={s.hidden}><strong>Beginnt am:</strong> {todo.startDate}</p>
    //                     <p className={`${s.description} ${s.hidden}`}><strong>Todo:</strong> {todo.description}</p>
    //
    //                     <div className={`${s.cardActions} ${s.hidden}`}>
    //
    //                         <select className={s.button}
    //                             value={todo.status}
    //                             onChange={(e) => handleSetStatus(todo.id, e.target.value)}
    //                         >
    //                             <option value="TODO">TODO</option>
    //                             <option value="DOING">DOING</option>
    //                             <option value="DONE">DONE</option>
    //                         </select>
    //
    //                         <Button className={s.navigateBtn} onClick={() => navigate(`/updateToDo/${todo.id}`)} text={`Todo ändern`} />
    //
    //                         <Button className={s.deleteBtn} onClick={() => handleDeleteTodo(todo.id)} text={`Todo löschen`}/>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    //
    //
    //
    //
    // );
}

export default TodoPage;