import {
    useGetCurriculumForCurrentUserQuery,
    useDeleteCurriculumMutation,
    useCreateCurriculumMutation
} from "../../services/api/curriculumApi.js";
import s from './CurriculumPage.module.scss';
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {showCurriculum, createCurriculum, deleteCurriculum} from "../../redux/curriculum/curriculumSlice.js";
import Button from "../../components/Button/Button.jsx";
import {useState} from "react";
import {getAllTodos} from "../../redux/todos/todoSlice.js";


function CurriculumPage(){
    const dispatch = useDispatch();
    // const { data: curriculum, isLoading } = useGetCurriculumForCurrentUserQuery();
    const { data: curriculum, isLoading, isError } = useGetCurriculumForCurrentUserQuery();
    const [title, setTitle] = useState('');

    const [createCurriculum] = useCreateCurriculumMutation();
    const [deleteCurriculum] = useDeleteCurriculumMutation();
    const user = useSelector((state) => state.auth.user);
    const allTodos = useSelector(getAllTodos);

    let curryTodos = [];

    if (curriculum) {
        curryTodos = allTodos
            .filter(todo => todo.curriculumIds.includes(curriculum.id))
            .sort((a, b) => a.id - b.id);
    }

    useEffect(() => {
        if (!isLoading && curriculum) {
            dispatch(showCurriculum(curriculum));
        }
    }, [dispatch, isLoading, curriculum]);

    const handleDeleteCurriculum = async () =>  {
        try {
            await deleteCurriculum().unwrap();
            dispatch(deleteCurriculum(curriculum));

        } catch (err) {
            console.error("Fehler beim Löschen", err);
        }
    }

    const handleCreateCurriculum = async () => {
        try {
            const newCurry = { title};
            await createCurriculum(newCurry).unwrap();
            dispatch(createCurriculum(newCurry));
            setTitle('');
        } catch (err){
            console.error("blablabla", err)
        }
    }

    if (isLoading) return <div>Lade Curriculums...</div>;

    if (isError || !curriculum) {
        return (
            <div >
                Hey {user.username}, du hast noch kein Curriculum!
                <br/>
                <label for="newCurrName">Name des Curriculums: </label>
                <input id="newCurrName" type="text" value={title} onChange={(e)=>setTitle(e.target.value)} required></input>
                <Button onClick={handleCreateCurriculum}>Curriculum erstellen</Button>
            </div>
        );
    }

    return (
        <div className={s.curryContainer}>
            <h1>{user.username} mit der Rückennummer {user.id}</h1>
            <h2>präsentiert</h2>
            {/*<p><strong>Username:</strong> {user.username}</p>*/}
            {/*<p><strong>Benutzer-ID:</strong> {curriculum.userId}</p>*/}
            <p>id: {curriculum.id}</p>
            <h1><strong>{curriculum.title} curryculum</strong></h1>

            <Button onClick={handleDeleteCurriculum}>Curriculum löschen</Button>
            <h2>Todos in diesem knackigen Curryculum:</h2>
            {curryTodos.map((todo)=>(
                <div key={todo.id}>{todo.id}
                </div>
            ))}
        </div>
    );
}

export default CurriculumPage;