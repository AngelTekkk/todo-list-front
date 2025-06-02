import s from "./StatisticCard.module.scss";

function StatisticCard({ title, value }) {
    return (
        <div className={s.statCardBoard}>
            <h3 className={s.statCardH3}>{title} - {value}</h3>
        </div>
    );
}

export default StatisticCard;
