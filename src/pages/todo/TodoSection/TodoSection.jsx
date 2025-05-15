import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../components/Button/Button.jsx";
import s from "./TodoSection.module.scss";

const CARD_LIMIT = 5;

function ToDoSection({
                         status,
                         todos,
                         onSetStatus,
                         onToggleStatus,
                         onDeleteTodo,
                         onNavigate,
                     }) {
    const todosForThisSection = todos.filter(todo => todo.status === status);
    const sortedTodos = todosForThisSection
        .slice()
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));


    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0);

    const maxPage = Math.ceil(sortedTodos.length / CARD_LIMIT) - 1;

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setPage((prev) => prev + newDirection);
    };

    const todosToDisplay = sortedTodos.slice(
        page * CARD_LIMIT,
        page * CARD_LIMIT + CARD_LIMIT
    );

    const variants = {
        enter: (dir) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <section className={s.section}>
            <h3>{status}</h3>

            <div className={s.carousel}>
                <button
                    onClick={() => paginate(-1)}
                    className={s.arrowLeft}
                    disabled={page === 0}
                >
                    ⬅️
                </button>

                <div className={s.todoCardGroup}>
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={page}
                            className={s.todoCardSet}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {todosToDisplay.map((todo) => (
                                <div key={todo.id} className={s.todoCard}>
                                    <Button
                                        className={s.fancyStatus}
                                        onClick={() => onToggleStatus(todo.id, todo.status)}
                                        text={todo.status}
                                    />

                                    <h4 className={s.todoTitle}>{todo.title}</h4>
                                    <p className={s.startDate}><strong>Start:</strong> {todo.startDate}</p>
                                    <p className={s.endDate}><strong>Ende:</strong> {todo.endDate}</p>
                                    <p className={s.description}><strong>Beschreibung:</strong> {todo.description}</p>

                                    <div className={s.cardActions}>
                                        <select
                                            className={s.button}
                                            value={todo.status}
                                            onChange={(e) => onSetStatus(todo.id, e.target.value)}
                                        >
                                            <option value="TODO">TODO</option>
                                            <option value="DOING">DOING</option>
                                            <option value="DONE">DONE</option>
                                        </select>

                                        <Button
                                            className={s.navigateBtn}
                                            onClick={() => onNavigate(todo.id)}
                                            text="Todo ändern"
                                        />
                                        <Button
                                            className={s.deleteBtn}
                                            onClick={() => onDeleteTodo(todo.id)}
                                            text="Todo löschen"
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => paginate(1)}
                    className={s.arrowRight}
                    disabled={page === maxPage}
                >
                    ➡️
                </button>
            </div>
        </section>
    );
}

export default ToDoSection;





// import React from "react";
// import Button from "../../../components/Button/Button.jsx";
// import s from "./TodoSection.module.scss";
//
// function ToDoSection({
//                          status,
//                          todos,
//                          onSetStatus,
//                          onToggleStatus,
//                          onDeleteTodo,
//                          onNavigate,
//                      }) {
//     // Die 5 bald fälligen ToDos
//     const todosToDisplay = todos
//         .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
//         .slice(0, 5);
//
//     if (todosToDisplay.length === 0) {
//         return (
//             <section className={s.section}>
//                 <h3>{status}</h3>
//                 <p>Keine ToDos in diesem Status.</p>
//             </section>
//         );
//     }
//
//     return (
//         <section className={s.section}>
//             <h3>{status}</h3>
//             <div className={s.todoCards}>
//                 {todosToDisplay.map((todo) => (
//                     <div key={todo.id} className={s.todoCard}>
//                         <Button
//                             className={s.fancyStatus}
//                             onClick={() => onToggleStatus(todo.id, todo.status)}
//                             text={todo.status}
//                         />
//
//                         <h4 className={s.todoTitle}>{todo.title}</h4>
//                         <p className={s.startDate}><strong>Start am:</strong> {todo.startDate}</p>
//
//                         <p className={s.endDate}><strong>Ende am:</strong> {todo.endDate}</p>
//                         <p className={s.description}><strong>Beschreibung: </strong>{todo.description}</p>
//
//                         <div className={s.cardActions}>
//                             <select
//                                 className={s.button}
//                                 value={todo.status}
//                                 onChange={(e) => onSetStatus(todo.id, e.target.value)}
//                             >
//                                 <option value="TODO">TODO</option>
//                                 <option value="DOING">DOING</option>
//                                 <option value="DONE">DONE</option>
//                             </select>
//
//                             <Button
//                                 className={s.navigateBtn}
//                                 onClick={() => onNavigate(todo.id)}
//                                 text="Todo ändern"
//                             />
//
//                             <Button
//                                 className={s.deleteBtn}
//                                 onClick={() => onDeleteTodo(todo.id)}
//                                 text="Todo löschen"
//                             />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }
//
// export default ToDoSection;
