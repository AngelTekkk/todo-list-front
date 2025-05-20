import {useGetCurriculumForCurrentUserQuery} from "../../services/api/curriculumApi.js";

import React from "react";
import {useSelector} from "react-redux";
// import {useCheckAuthQuery} from "../../services/api/authApi.js";


function CurriculumPage(){
    const { data: curriculum, error, isLoading } = useGetCurriculumForCurrentUserQuery();
    // const { data: user } = useCheckAuthQuery();
    const user = useSelector((state) => state.auth.user);

    if (isLoading) return <div>Lade Curriculums...</div>;
    if (error) return <div>Fehler beim Laden: {error.message || "Unbekannter Fehler"}</div>;
    if (!curriculum) return <div>Kein Curriculum gefunden.</div>;


    return (
        <div>
            <h1>Mein Lernplan</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Titel:</strong> {curriculum.title}</p>
            <p><strong>Benutzer-ID:</strong> {curriculum.userId}</p>
        </div>
    );
}

export default CurriculumPage;