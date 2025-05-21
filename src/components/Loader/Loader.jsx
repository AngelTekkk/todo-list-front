import s from "./Loader.module.scss";

function Loader() {
    return (
            <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGY1MDVrMjZidjVrb3ZyaTF6cjJ1bjYxbjd5dzFtenY1Z3lxMGthOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3nWhI38IWDofyDrW/giphy.gif"
                 alt="loading" className={s.loadingImg} />
    )
}

export default Loader;