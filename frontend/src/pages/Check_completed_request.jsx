import React, { useState, useEffect } from "react";
import '../styles/Check_completed_request.css'
import Menu from "../comps/Menu";
import Arrow from '../images/Стрелка_назад.png';
import { useParams } from "react-router-dom";
import axios from 'axios';

const Check_completed_request = () => {
    const { id } = useParams();
    const [feedback, setFeedback] = useState({});
    const [feedbackResponse, setFeedbackResponse] = useState({});
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/Feedback/ID/${id}/`)
            .then(response => response.json())
            .then(data => {
                setFeedback(data);
                fetch(`http://localhost:8000/FeedbackResponse/${data.id}/`)
                    .then(response => response.json())
                    .then(data => setFeedbackResponse(data));
            });
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:8000/Images/${id}/`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении изображений: ', error);
            });
    }, [id]);


    const Back_Arrow = () => {
        const onClick = () => {
            window.location.assign('/completed_requests');
        };

        return (
            <button className="back-arrow" onClick={onClick}><img src={Arrow}></img></button>
        );
    };
    return (
        <div>
            <Menu />
            <Back_Arrow />
            <div className="main-container-check-request">
                <h1 className="topic-title-request">{feedback.topic}</h1>
                <div className="left-check-request">
                    <div className="title-left-column">Детали обращения</div>
                    <div className="body-left">
                        <h4>Пользователь</h4>
                        <p>{feedback.Feedback_name}</p>
                        <h4>Дата регистрации</h4>
                        <p>{feedback.Feedback_date}</p>
                        <h4 htmlFor="userMessage">Обращение</h4>
                        <p><textarea id="userMessage" className="text-appeal-request" type="text" readOnly value={feedback.Feedback_txt} /></p>
                        <div className="image-container">
                            {images.map((image, index) => (
                                <img key={index} src={`http://localhost:8000${image.image}`} alt={`Изображение ${index + 1}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="right-check-request">
                    <div className="title-right-column">Решение по обращению</div>
                    <div className="body-left">
                        <h4>Дата решения</h4>
                        <p>{feedbackResponse.Response_date}</p>
                        <h4 htmlFor="userMessage">Решение</h4>
                        <p><textarea id="userMessage" className="text-appeal-request" type="text" readOnly value={feedbackResponse.Response_txt} /> </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Check_completed_request;