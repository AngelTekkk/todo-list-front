import {
    useGetCurriculumForCurrentUserQuery,
    useDeleteCurriculumMutation,
    useCreateCurriculumMutation, useRemoveTodoFromCurryMutation
} from "../../services/api/curriculumApi.js";
import s from './CurriculumPage.module.scss';
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {showCurriculum, createCurriculum, deleteCurriculum} from "../../redux/curriculum/curriculumSlice.js";
import Button from "../../components/Button/Button.jsx";
import {useState} from "react";
import {getAllTodos} from "../../redux/todos/todoSlice.js";
import {useGetTodosQuery} from "../../services/api/todoApi.js";


function CurriculumPage() {
    const dispatch = useDispatch();
    // const { data: curriculum, isLoading } = useGetCurriculumForCurrentUserQuery();
    const {data: curriculum, isLoading, isError} = useGetCurriculumForCurrentUserQuery();
    const [title, setTitle] = useState('');
    const { data: todos, refetch: refetchTodos } = useGetTodosQuery();

    const [createCurriculumApi] = useCreateCurriculumMutation();
    const [deleteCurriculumApi] = useDeleteCurriculumMutation();
    const [removeTodoFromCurryMutationApi] = useRemoveTodoFromCurryMutation();
    const user = useSelector((state) => state.auth.user);

    let curryTodos = [];

    if (curriculum && todos) {
        curryTodos = todos
            .filter(todo => todo.curriculumIds.includes(curriculum.id))
            .sort((a, b) => a.id - b.id);
    }

    useEffect(() => {
        if (!isLoading && curriculum) {
            dispatch(showCurriculum(curriculum));
        }
    }, [dispatch, isLoading, curriculum]);

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
            console.error("blablabla", err)
        }
        setTitle('');
    }

    const handleRemoveTodoFromCurry = async(todoId = null) => {
        try {
            await removeTodoFromCurryMutationApi(todoId)
            await refetchTodos();
            // dispatch(showCurriculum(curriculum));
        } catch (err) {
            console.error("blablabla", err)
        }
    }

    if (isLoading) return <div>Lade Curriculums...</div>;

    if (isError || !curriculum) {
        return (
            <div className={s.createCurry}>
                <h1>Hey {user.username}, du hast noch kein Curriculum!</h1>
                <label for="newCurrName">Name des Curriculums: </label>
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
                {curryTodos.map((todo) => (
                    <tr key={todo.id} className={s.todoRow}>
                        <td >{todo.title}</td>
                        <td >{todo.startDate}</td>
                        <td >{todo.endDate}</td>
                        <td >{todo.status}</td>
                        <td >
                            <Button className={s.tableButton}>Ansehen</Button>
                            <Button className={s.tableButton}
                                    onClick={() => handleRemoveTodoFromCurry(todo.id)}
                                    text={'Entfernen'}>
                            </Button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CurriculumPage;