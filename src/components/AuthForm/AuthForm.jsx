import s from "./AuthForm.module.scss";
import {useState} from "react";
import {useDispatch} from "react-redux";

import {useCheckAuthQuery, useLoginMutation, useRegisterMutation} from "../../services/api/authApi.js";
import {oauth} from "../../redux/auth/authSlice.js";
import Button from "../Button/Button.jsx";

function AuthForm({type = 'login', onSuccess}) {
    const dispatch = useDispatch();
    const isLogin = type === 'login';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();

    const {refetch: checkAuth} = useCheckAuthQuery();

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = "Benutzername ist erforderlich";
        if (!formData.password.trim()) newErrors.password = "Passwort ist erforderlich";
        if (!isLogin) {
            if (!formData.firstName.trim()) newErrors.firstName = "Vorname ist erforderlich";
            if (!formData.lastName.trim()) newErrors.lastName = "Nachname ist erforderlich";
            if (!formData.email.trim()) newErrors.email = "E-Mail ist erforderlich";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                newErrors.email = "Ungültige E-Mail-Adresse";
            if (formData.password.length < 8)
                newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = isLogin
            ? {username: formData.username, password: formData.password}
            : {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
            };

        try {
            const result = isLogin
                ? await login(payload).unwrap()
                : await register(payload).unwrap();
            const user = await checkAuth().unwrap();
            dispatch(oauth(user));
            console.log("✅ Erfolg:", result, user);
            onSuccess();
        } catch (err) {
            console.error("❌ Fehler:", err);
            setErrors({form: "Authentifizierung fehlgeschlagen"});
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {errors.form && <p style={{color: 'red'}}>{errors.form}</p>}

            {isLogin ? <h2 className={s.loginTopic}>Gib deine Benutzerdaten ein um dich anzumelden</h2> : <h2 className={s.registerTopic}>Registrieren</h2>}

            {!isLogin && (
                <>
                    <label>
                        Vorname:
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}/>
                        {errors.firstName && <span style={{color: 'red'}}>{errors.firstName}</span>}
                    </label>

                    <label>
                        Nachname:
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}/>
                        {errors.lastName && <span style={{color: 'red'}}>{errors.lastName}</span>}
                    </label>

                    <label>
                        E-Mail:
                        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
                        {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
                    </label>
                </>
            )}

            <div className={s.loginRegisterModal}>
                <label htmlFor={"username"}>
                    <h3 className={s.userNameH3}>Benutzername:</h3>
                    <input className={s.userName} type="text" name="username" value={formData.username}
                           onChange={handleChange}/>
                    {errors.username && <span style={{color: 'red'}}>{errors.username}</span>}
                </label>

                <label htmlFor={"password"}>
                    <h3 className={s.passWordH3}>Passwort:</h3>
                    <input  className={s.passWord} type="password" name="password" value={formData.password}
                           onChange={handleChange}/>
                    {errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
                </label>

                <Button className={s.submitBtn} type="submit" text={isLogin ? "Einloggen" : "Registrieren"} />
            </div>
        </form>
    );
}

export default AuthForm;