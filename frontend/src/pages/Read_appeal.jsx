import React, { useState, useEffect } from "react";
import css from "../styles/Read_appeal.css";
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BackButton = () => {
    const onClick = () => {
        window.location.assign('/appeals');
    };

    return (
        <button className="back-button" onClick={onClick}>Назад</button>
    );
};

function Read_appeal(){
    const { id } = useParams();
    const [text, setText] = useState("");
    const [userName, setUserName] = useState("");
    const [date, setDate] = useState("");
    const [managerID, setManagerID] = useState();
    const [Edited, setEdited] = useState("");
    const [images, setImages] = useState([]);
    const feedback = {
        user: "Аноним",
        date: "2024-05-01",
        message: "Здесь будет обращение...",
        photo: "url"
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

    const handleAnswerClick = () => {
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

    return (
        <div>
            <div className="back-container">
                <BackButton/>
            </div>
            <div className="main-container1">
            <div className="header-container">
                <h1 className="appeal-title">Обращение</h1>
            </div>
            <Link to={`/RejectRequest/${id}`}>
                <button type="button" className="reject">Отклонить обращение</button>
            </Link>
                 <div className="left-section1">
                    <div className="form-container1">
                    <p className="section-title1">Детали обращения</p>
                        <form className="form5">
                            <h3>Пользователь</h3>
                            <p>{userName}</p>
                            <h3>Дата регистрации</h3>
                            <p>{date}</p>
                            <h3 htmlFor="userMessage">Обращение</h3>
                            <p><input id="userMessage" className="input5" type="text" readOnly value={text} /> </p>
                            <div className="image-container">
                                {images.map((image, index) => (
                                    <img key={index} src={`http://localhost:8000${image.image}`} alt={`Изображение ${index + 1}`} />
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="button-container">
                <Link to={`/Answer/${id}`}>
                    <button type="button" className="answer" onClick={handleAnswerClick}>Ответить</button>
                </Link>
            </div>
        </div>
    );
};

export default Read_appeal;