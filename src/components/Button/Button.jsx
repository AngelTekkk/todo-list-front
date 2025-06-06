import s from "./Button.module.scss"

function Button(props) {
    return (
        <button className={props.className ? props.className : s.btn} onClick={props.onClick} disabled={props?.disabled}>{props.children ?? props.text}</button>
    )
}

export default Button;