import React, { useState, useEffect } from "react";
import '../styles/FeedBack.css'
import phone from '../images/phone.png'
import Head2 from '../views/global/global/Head2'
import { useParams } from "react-router-dom";

function Phone() {
    return <img className='phone' src={phone}></img>
}

const Check_answer = () => {
    const [feedback, setFeedback] = useState("");
    const [feedbackResponse, setFeedbackResponse] = useState("");
    const [images, setImages] = useState([]);
    const { key } = useParams();
    const [manager, setManager] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8000/FeedbackKey/${key}/`)
            .then(response => response.json())
            .then(feedbackData => {
                setFeedback(feedbackData);
                fetch(`http://localhost:8000/FeedbackResponse/${feedbackData.id}/`)
                    .then(response => response.json())
                    .then(feedbackResponseData => {
                        setFeedbackResponse(feedbackResponseData);
                        fetch(`http://localhost:8000/manager_by_feedbackresponse/${feedbackResponseData.manager_id}/`)
                            .then(response => response.json())
                            .then(managerData => setManager(managerData));
                    });
            });
    }, [key]);

    useEffect(() => {
        fetch(`http://localhost:8000/FeedbackKey/${key}/`)
            .then(response => response.json())
            .then(data => {
                setFeedback(data);
                fetch(`http://localhost:8000/Images/${data.id}/`)
                    .then(response => response.json())
                    .then(data => setImages(data));
            });
    }, [key]);

    let statusColor;
    switch (feedback.status) {
        case "Рассмотрено":
            statusColor = "green";
            break;
        case "Отклонено":
            statusColor = "red";
            break;
        case "В работе":
            statusColor = "yellow";
            break;
        default:
            statusColor = "black";
    }

    const statusTranslations = {
        "NEW": "Новое",
        "IN_PROGRESS": "В работе",
        "COMPLETED": "Рассмотрено",
        "REJECTED": "Отклонено"
    };

    const statusStyle = {
        backgroundColor: statusColor
    };

    return (
        <div className="conteiner-feedback">
            <Head2 />
            <h1 className="feedback-title">Обратная связь</h1>
            <div className="left-feedback">
                <div className="delails-appeal">
                    <div className="title-left-column">Детали обращения</div>
                    <div className="form-feedback">
                        <h3>Текущий статус</h3>
                        <p id="black-text">  {statusTranslations[feedback.status]}
                            <span className={`status ${statusColor}`}></span>
                        </p>
                        <h3>Дата регистрации</h3>
                        <p>{feedback.Feedback_date}</p>
                        <h3 htmlFor="userMessage">Обращение</h3>
                        <p><textarea id="userMessage" className="input-feedback-appeal" type="text" readOnly value={feedback.Feedback_txt} /></p>
                        <div className="image-container">
                            {images.map((image, index) => (
                                <img key={index} src={`http://localhost:8000${image.image}`} alt={`Изображение ${index + 1}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-feedback">
                <div className="decision-appeal">
                    <div className="title-right-column">Решение по обращению</div>
                    <div className="form-decision">
                        <h3>Дата решения</h3>
                        <p>{feedbackResponse.Response_date}</p>
                        <h3 htmlFor="userMessage">Решение</h3>
                        <p><textarea id="userMessage" className="input-feedback-appeal" type="text" readOnly value={feedbackResponse.Response_txt} /> </p>
                        <div className="manager-info">
                            <h3>Контактные данные менеджера</h3>
                            <p>{manager.username}</p>
                            <p>{manager.email}</p>
                            <Phone />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Check_answer;
