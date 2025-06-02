import { GraduationCap } from "lucide-react";
import s from "./CurryWidget.module.scss";

function CurryWidget({ plan }) {
    const progress = plan.total > 0 ? Math.round((plan.completed / plan.total) * 100) : 0;

    return (
        <div className={s.widget}>
            <div className={s.header}>
                <GraduationCap size={20} />
                <h3>Lernfortschritt</h3>
            </div>
            <div className={s.barWrapper}>
                <div className={s.bar}>
                    <div className={s.fill} style={{ width: `${progress}%` }}></div>
                </div>
                <span>{progress}% ({plan.completed}/{plan.total})</span>
            </div>
        </div>
    );
}

export default CurryWidget;
