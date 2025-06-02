import {
    useDeleteCurriculumMutation,
    useCreateCurriculumMutation, useRemoveTodoFromCurryMutation, useAddTodoToCurryMutation
} from "../../services/api/curriculumApi.js";
import s from './CurriculumPage.module.scss';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {createCurriculum, deleteCurriculum, getCurriculum} from "../../redux/curriculum/curriculumSlice.js";
import Button from "../../components/Button/Button.jsx";
import {useState} from "react";
import {updateTodoModal} from "../../redux/dashboard/dashboardSlice.js";
import ModalWindow from "../../components/ModalWindow/ModalWindow.jsx";
import {addTodoToCurry, deleteTodoFromCurry, getAllTodos} from "../../redux/todos/todoSlice.js";
import {getUser} from "../../redux/auth/authSlice.js";
import CustomSelect from "../../components/CustomDropdown/CustomDropdown.jsx";

function CurriculumPage() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const user = useSelector(getUser);
    const allTodosInState = useSelector(getAllTodos);
    const curriculum = useSelector(getCurriculum);

    const [createCurriculumApi] = useCreateCurriculumMutation();
    const [deleteCurriculumApi] = useDeleteCurriculumMutation();
    const [removeTodoFromCurryMutationApi] = useRemoveTodoFromCurryMutation();
    const [addTodoToCurryMutationApi] = useAddTodoToCurryMutation();

    const handleDeleteCurriculum = async () => {
        try {
            await deleteCurriculumApi(curriculum.id).unwrap();
            dispatch(deleteCurriculum());

        } catch (err) {
            console.error("Fehler beim Löschen", err);
        }
    }

    const handleCreateCurriculum = async () => {
        try {
            const newCurry = {title};
            await createCurriculumApi(newCurry).unwrap();
            dispatch(createCurriculum(newCurry));

        } catch (err) {
            console.error("curry erstellen hat net geklappt", err)
        }
        setTitle('');
    }

    const handleRemoveTodoFromCurry = async(todoId = null) => {
        try {
            await removeTodoFromCurryMutationApi(todoId);
            dispatch(deleteTodoFromCurry({todoId, curriculum}));
        } catch (err) {
            console.error("todo vom curry entfernen hat net geklappt", err)
        }
    }
    const handleAssignCurry = async (toDoId, curryId) => {
        try{
            await addTodoToCurryMutationApi({toDoId, curryId});
            dispatch(addTodoToCurry({toDoId, curryId}))
        } catch (err) {
            console.error("todo zum curry hinzufügen hat net geklappt.", err)
        }
    }


    const handleOpenModal = (type, todoId = null) => {
        dispatch(updateTodoModal({type, todoId}));
    };


    if (!curriculum) {
        return (
            <div className={s.createCurry}>
                <h1>Hey {user.username}, du hast noch kein Curriculum!</h1>
                <label htmlFor="newCurrName">Name des Curriculums: </label>
                <input id="newCurrName" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                       required></input>
                <Button onClick={handleCreateCurriculum} className={s.button}>Curriculum erstellen</Button>
            </div>
        );
    }

    return (
        <div className={s.curryContainer}>
            <h1>{user.username} mit der Rückennummer {user.id}</h1>
            <h2 className={s.highlightText}>präsentiert</h2>
            <h1><strong>{curriculum.title} curryculum</strong></h1>

            <div className={s.buttonWrapper}>
                <Button onClick={handleDeleteCurriculum} className={s.button}>Curriculum löschen</Button>
            </div>
            <h2 className={s.highlightText}>Todos in diesem knackigen Curryculum:</h2>

            <table className={s.todoTable}>
                <thead>
                <tr>
                    <th >Titel</th>
                    <th >Beginn</th>
                    <th >Fällig</th>
                    <th >Status</th>
                    <th >Optionen</th>
                </tr>
                </thead>
                <tbody>
                {allTodosInState
                    .filter(todo => todo.curriculumIds
                        .includes(curriculum.id))
                    .sort((a, b) => a.id - b.id).map((todo) => (
                    <tr key={todo.id} className={s.todoRow}>
                        <td >{todo.title}</td>
                        <td >{todo.startDate}</td>
                        <td >{todo.endDate}</td>
                        <td >{todo.status}</td>
                        <td >
                            <Button className={s.tableButton}
                                    onClick={() => handleOpenModal('showTodo', todo.id)}
                                    text={'Ansehen'}>
                            </Button>
                            <Button className={s.tableButton}
                                    onClick={() => handleRemoveTodoFromCurry(todo.id)}
                                    text={'Entfernen'}>
                            </Button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={s.assignTodo}>
                <p>Todo hinzufügen: </p>
                <CustomSelect
                    value={
                    curriculum.id || ""}
                    options={[
                        {value: "", label: "Bitte wählen"},
                        ...allTodosInState.filter(todo=>
                        todo.creator === user.username && !todo.curriculumIds.includes(curriculum.id)
                        )
                            .map(todo => ({
                            value: todo.id,
                            label: todo.title,
                        }))
                    ]}
                    onChange={(toDoId) => handleAssignCurry(toDoId, curriculum.id)}

                />


            </div>
            <ModalWindow></ModalWindow>

        </div>

    );
}

export default CurriculumPage;