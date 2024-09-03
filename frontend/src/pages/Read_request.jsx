import React, { useState, useEffect } from "react";
import '../styles/Read_request.css';
import Menu from "../comps/Menu.jsx";
import Arrow from '../images/Стрелка_назад.png';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Read_request = () => {
    const navigate = useNavigate();  
    const { id } = useParams();
    const [text, setText] = useState("");
    const [userName, setUserName] = useState("");
    const [date, setDate] = useState("");
    const [managerID, setManagerID] = useState();
    const [Edited, setEdited] = useState("");
    const [images, setImages] = useState([]);
    const feedback = {
        name: "Алексей",
        date: "2024-05-01",
        message: "Здесь будет обращение...",
        photo: "url",
        topic: "Сломан принтер"
    };

    const Back_Arrow = () => {
        const onClick = () => {
            navigate(-1); 
        };

        return (
            <button className="back-arrow" onClick={onClick}><img src={Arrow} alt="Стрелка назад" /></button>
        );
    };

    const handleReject = () => {

    };

    const handleAnswer = () => {
        // Проверка на существование ответа на обратную связь с данным внешним ключом feedback
        axios.get(`http://localhost:8000/FeedbackResponse/${id}/`)
            .then(response => {
                console.log('Ответ на обратную связь уже существует');
                setEdited(true);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    // Ответа на обратную связь не существует, создаем новый
                    axios.post('http://localhost:8000/FeedbackResponse/create/', {
                        Response_theme: 'Новая тема',  // Замените на нужные значения
                        Response_txt: 'Новый текст ответа',  // Замените на нужные значения
                        feedback: id,  // ID из параметров URL
                        manager: managerID,  // Замените на нужные значения
                        Edited: true  // Устанавливаем Edited в true
                    })
                        .then(response => {
                            console.log(response.data);
                            setEdited(true);  // Обновляем значение Edited в состоянии
                            // Обновление статуса обращения
                            axios.post(`http://localhost:8000/Feedback/IN_PROGRESS/${id}/`)
                                .then(response => {
                                    console.log(response.data);
                                    // Вы можете добавить здесь действия после обновления статуса
                                })
                                .catch(error => {
                                    console.error('Ошибка при обновлении статуса: ', error);
                                });
                        })
                        .catch(error => {
                            console.error('Ошибка при создании нового ответа: ', error);
                        });
                } else {
                    console.error('Ошибка при проверке существования ответа: ', error);
                }
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/Images/${id}/`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении изображений: ', error);
            });
    }, [id]);

    useEffect(() => {
        const fetchManagerID = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get_manager_id/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                setManagerID(response.data.managerID);
            } catch (error) {
                console.error('Error fetching manager ID: ', error);
            }
        };

        fetchManagerID();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000')
            .then(response => {
                const feedbackById = response.data.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                }, {});
                setText(feedbackById[id].Feedback_txt);
                setUserName(feedbackById[id].Feedback_name);
                setDate(feedbackById[id].Feedback_date);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [id]);

    return (
        <div>
            <Menu />
            <Back_Arrow />
            <div className="main-container-read-request">
                <h1 className="topic-title-request">Обращение</h1>
                <Link to={`/RejectRequest/${id}`}>
                    <button type="button" className="reject1" onClick={handleReject}>Отклонить</button>
                </Link>
                <div className="left-check-request">
                    <div className="title-left-column1">Информация о пользователе</div>
                    <div className="body-left">
                        <h4>Пользователь</h4>
                        <p><span className="user-name">{userName}</span></p>
                        <h3>Дата регистрации</h3>
                        <p><span className="user-date">{date}</span></p>
                    </div>
                </div>
                <div className="right-check-request1">
                    <div className="title-right-column1">Детали обращения</div>
                    <div className="body-left">
                        <h4 htmlFor="userMessage">Обращение</h4>
                        <p><textarea id="userMessage" className="text-appeal-request" readOnly value={text} /></p>
                        <div className="image-container">
                            {images.map((image, index) => (
                                <img key={index} src={`http://localhost:8000${image.image}`} alt={`Изображение ${index + 1}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="button-container-answer">
                    <Link to={`/Answer/${id}`}>
                        <button type="button" className="answer-read-appeal" onClick={handleAnswer}>Ответить</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Read_request;