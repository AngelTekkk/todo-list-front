import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAllTodos } from "../../redux/todos/todoSlice";
import { getDaysLeftColor } from "../../components/LeftDaysColor/GetLeftDaysColor";
import s from "./TodoCalendar.module.scss";
import Button from "../../components/Button/Button";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    setMonth,
    getMonth,
} from "date-fns";
import { motion } from "framer-motion";
import {de} from "date-fns/locale";

function TodoCalendar() {
    const todos = useSelector(getAllTodos);
    const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
    const today = new Date();
    const customDate = setMonth(today, selectedMonth);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(customDate),
        end: endOfMonth(customDate),
    });

    const getTodosForDay = (day) => {
        return todos.filter((todo) => {
            const todoDate = new Date(todo.endDate);
            return isSameDay(todoDate, day);
        });
    };

    return (
        <div>
            <div className={s.monthSwitcher}>
                <div className={s.monthButtons}>{Array.from({ length: 12 }, (_, i) => (
                    <Button
                        key={i}
                        onClick={() => setSelectedMonth(i)}
                        className={selectedMonth === i ? s.activeMonth : undefined}
                        text={format(new Date(2025, i, 1), "MMMM", {locale: de})}
                    />
                ))}</div>
                <span className={s.monthName}>{format(new Date(2025, selectedMonth, 1), "MMMM", {locale: de})}</span>
            </div>

            <div className={s.calendarWrapper}>
                {daysInMonth.map((day) => {
                    const todosForDay = getTodosForDay(day);
                    const isToday = isSameDay(day, new Date());


                    return (
                        <div key={day.toISOString()} className={`${s.calendarDay} ${isToday ? s.todayHighlight : ""}`}>
                            <span className={s.dayName}>{format(day, "EEEE", {locale: de})}</span>
                            <span className={s.dateLabel}>{format(day, "d")}</span>
                            <div className={s.todoCubes}>
                                {todosForDay.map((todo) => (
                                    <motion.div
                                        key={todo.id}
                                        className={s.todoCube}
                                        style={{ backgroundColor: getDaysLeftColor(todo.endDate) }}
                                        whileHover={{ scale: 1.5, zIndex: 99 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className={s.todoPopup}>
                                            <h4 className={s.calendarDayTodoTitle}>{todo.title}</h4>
                                            <p className={s.calendarDayTodoStatus}>Status: {todo.status}</p>
                                            <p className={s.calendarDayTodoDescription}>{todo.description}</p>
                                            <p className={s.calendarDayTodoDate}>Fällig am: {format(new Date(todo.endDate), "dd.MM.yyyy")}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TodoCalendar;


