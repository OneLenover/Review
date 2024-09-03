import React, { useState, useEffect } from "react";
import Head2 from "../views/global/global/Head2";
import "../styles/Login.css"
import Login_man from "../images/Login.png"
import axios from 'axios';

function Login_man_png() {
    return (
        <img className="login_man" src={Login_man}></img>
    )
}

class Vxod extends React.Component {
    onclick() {
        window.location.assign('/appeals')
    }
    render() {
        return <button className="Vxod" onClick={(e) => this.onclick(e)}>Войти</button>
    }
}

const InputComponent = (props) => {
    const { name, placeholder, value, onChange } = props;
    return (
        <React.Fragment>
            <input
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-login"
                type="text"
                maxLength="100"
            />
        </React.Fragment>
    );
}

const Login = () => {
    const [pass, setPassword] = useState("");
    const [name, setUsername] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const account = await axios.post('http://127.0.0.1:8000/api/login/', {
                username: name,
                password: pass
            });
            console.log(account.data);
            localStorage.setItem('token', account.data.token);
            window.location.assign('/new_requests');
        }
        catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
                alert('Неверные учетные данные');
            } else {
                alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
            }
        }
    }

    useEffect(() => {

        document.body.classList.add('application-background');

        return () => {
            document.body.classList.remove('application-background');
        };
    }, []);

    return (
        <div className="body11">
            <div className="container_fon">
                <Head2 />
                <div className="div-login">
                    <div className="div_right-login">
                        <div className="title-login">Добро пожаловать!</div>
                        <form className="form1" onSubmit={handleSubmit}>
                            <InputComponent name='login' placeholder={"Логин"} value={name} onChange={e => setUsername(e.target.value)} />
                            <InputComponent name='password' placeholder={"Пароль"} value={pass} onChange={e => setPassword(e.target.value)} />
                            <button type="submit" className="Vxod">Войти</button>
                        </form>
                    </div>
                    <div className="div_left-login">
                        <Login_man_png />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
