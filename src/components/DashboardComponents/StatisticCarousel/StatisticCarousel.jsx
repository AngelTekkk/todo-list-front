import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatisticCard from "../StatisticCard/StatisticCard.jsx";

import { useSelector } from "react-redux";
import { getAllTodos } from "../../../redux/todos/todoSlice.js";
import { getAllProjects } from "../../../redux/projects/projectsSlice.js";
import { getCurriculum } from "../../../redux/curriculum/curriculumSlice.js";
import { format } from "date-fns";

function StatCarousel() {
    const todos = useSelector(getAllTodos);
    const projects = useSelector(getAllProjects);
    const curry = useSelector(getCurriculum);

    const nextTodos = todos
        .filter(t => t.endDate && t.status !== "done")
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    const nextDeadline = nextTodos.length > 0
        ? format(new Date(nextTodos[0].endDate), "dd.MM.yyyy")
        : "Keine offenen Aufgaben";

    const stats = [
        { title: "Offene Todos", value: todos.filter(t => t.status !== "done").length },
        { title: "Aktive Projekte", value: projects.length },
        { title: "Lernfortschritt", value: `${curry.completed}/${curry.total}` },
        { title: "Nächste Deadline", value: nextDeadline }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % stats.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [stats.length]);

    return (
        <div style={{ position: "relative", minHeight: "120px", overflow: "visible" }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: "absolute", width: "100%" }}
                >
                    <StatisticCard
                        title={stats[index].title}
                        value={stats[index].value}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default StatCarousel;
