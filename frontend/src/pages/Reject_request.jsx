import React from "react";
import "../styles/Answer.css"
import { useState, useEffect } from "react";
import Menu from '../comps/Menu'
import Arrow from '../images/Стрелка_назад.png'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Reject_request = () => {
    const [theme, setTheme] = useState("");
    const { id } = useParams();
    const [responseUser, setResponseUser] = useState("");
    const [managerID, setManagerID] = useState();

    useEffect(() => {
        const fetchManagerID = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get_manager_id/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}` // предполагается, что токен сохраняется в localStorage после входа в систему
                    }
                });
                setManagerID(response.data.managerID);
            } catch (error) {
                console.error('Error fetching manager ID: ', error);
            }
        };

        fetchManagerID();
    }, []);

    const BackButton = () => {
        const onClick = () => {
            window.location.assign(`/ReadRequest/${id}`);
        };

        return (
            <button className="back-arrow" onClick={onClick}><img src={Arrow}></img></button>
        );
    };

    const handleRequest = () => {
        axios.post('http://localhost:8000/FeedbackResponse/create/', {
            Response_theme: theme,
            Response_txt: responseUser,
            feedback: id,
            manager: managerID,
            Category: "Без категории",
        })
            .then(response => {
                console.log(response.data);
                axios.post(`http://localhost:8000/Feedback/REJECTED/${id}/`)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error('Ошибка при обновлении статуса: ', error);
                    });
            })
            .catch(error => {
                console.error('Ошибка при создании нового ответа: ', error);
            });
    };

    return (
        <React.Fragment>
            <Menu />
            <BackButton />
            <div className="conteiner-answer">
                <div className="left-answer">
                    <span className="important-text">Важно:</span><br></br>
                    <label className="text-info">При нажатии на стрелочку<br></br>в левом верхнем углу черновик обращения<br></br>автоматически сохраняется в категории<br></br>“Обращения в работе”</label>
                </div>
                <div className="right-answer">
                    <p className="text-topic">Для удобства определите тему обращения</p>
                    <input className="input-topic" type="text" name="name" placeholder="Введите название темы..." value={theme} onChange={e => setTheme(e.target.value)} />
                    <p className="answer-appeal">Укажите причину отклонения</p>
                    <textarea className="input-answer" type="text" name="name" placeholder="Введите причину..." value={responseUser} onChange={e => setResponseUser(e.target.value)} />
                    <Link to={'/new_requests'}>
                        <button className="send-answer" onClick={handleRequest}>Отправить</button>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Reject_request
