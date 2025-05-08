import {Fragment} from "react";
import "../todo/TodoPage.module.scss";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();


    return (
        <>
            <div>
                <button className="todopage btn" onClick={() => navigate("/todo-list-api/todos")}>zu meinen Todo's</button>
            </div>
        </>
    )
}

export default DashboardPage;