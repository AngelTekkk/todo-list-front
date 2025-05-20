import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../components/Button/Button.jsx";
import s from "./TodoSection.module.scss";
import CustomSelect from "../../../components/CustomDropdown/CustomDropdown.jsx";

const CARD_LIMIT = 5;

function ToDoSection({
                         status,
                         todos,
                         onSetStatus,
                         // onToggleStatus,
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



    // const getNextStatus = (currentStatus) => {
    //     switch (currentStatus) {
    //         case "TODO":
    //             return "🢂 DOING";
    //         case "DOING":
    //             return "🢂 DONE";
    //         case "DONE":
    //             return "🢂 TODO";
    //         default:
    //             return "🢂 TODO";
    //     }
    // };

    const getDaysLeftColor = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

        return daysLeft > 7
            ? 'rgba(72,204,104,0.1)'
            : daysLeft > 3
                ? 'rgba(253,220,117,0.1)'
                : 'rgba(250,108,121,0.1)';
    };

    return (
        <section className={s.section}>
            <h3>{status}</h3>

            <div className={s.carousel}>
                <Button
                    onClick={() => paginate(-1)}
                    className={s.arrowLeft}
                    disabled={page === 0}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 6L9 12L15 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Button>

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

                                <div key={todo.id} className={s.todoCard} style={{backgroundColor: getDaysLeftColor(todo.endDate)}}>
                                    {/*<Button*/}
                                    {/*    className={s.fancyStatus}*/}
                                    {/*    onClick={() => onToggleStatus(todo.id, todo.status)}*/}
                                    {/*    text={getNextStatus(todo.status)}*/}
                                    {/*/>*/}

                                    <h4 className={s.todoTitle}>{todo.title}</h4>
                                    <div className={s.cardStuff}>
                                        <p className={s.startDate}><strong>Start:</strong> {todo.startDate}</p>
                                        <p className={s.endDate}><strong>Ende:</strong> {todo.endDate}</p>
                                        <p className={s.description}><strong>Beschreibung:</strong> {todo.description}</p>
                                    </div>

                                    <div className={s.cardActions}>
                                        <CustomSelect
                                            value={todo.status}
                                            options={[
                                                { value: "TODO", label: "TODO" },
                                                { value: "DOING", label: "DOING" },
                                                { value: "DONE", label: "DONE" },
                                            ]}
                                            onChange={(newStatus) => onSetStatus(todo.id, newStatus)}
                                        />

                                        <Button
                                            className={s.navigateBtn}
                                            onClick={() => onNavigate(todo.id)}
                                            text="Ändern"
                                        />
                                        <Button
                                            className={s.deleteBtn}
                                            onClick={() => onDeleteTodo(todo.id)}
                                            text="Löschen"
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <Button
                    onClick={() => paginate(1)}
                    className={s.arrowRight}
                    disabled={page === maxPage}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 6L15 12L9 18"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Button>
            </div>
        </section>
    );
}

export default ToDoSection;
