import React, { useState, useEffect } from "react";
import '../styles/Answer.css'
import Arrow from '../images/Стрелка_назад.png'
import Menu from '../comps/Menu'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'

const Reject_request = () => {
    const { id } = useParams();
    const [theme, setTheme] = useState("");
    const [responseUser, setResponseUser] = useState("");
    const [managerID, setManagerID] = useState();
    const navigate = useNavigate();
    const [Edited, setEdited] = useState(false);

    const options = [
        { value: 'Без категории', label: 'Без категории' },
        { value: 'Кадровые вопросы', label: 'Кадровые вопросы' },
        { value: 'Техническая поддержка', label: 'Техническая поддержка' },
        { value: 'Организация работы', label: 'Организация работы' },
        { value: 'Административные вопросы', label: 'Административные вопросы' },
        { value: 'Финансовые вопросы', label: 'Финансовые вопросы' },
    ];
    const [selectedOption, setSelectedOption] = useState({ value: 'Без категории', label: 'Без категории' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Обновление существующего ответа на обратную связь
            const res = await axios.post(`http://localhost:8000/FeedbackResponse/update/${id}/`, {
                Response_theme: theme || "none",
                Response_txt: responseUser || "none",
                feedback: id,
                manager: managerID,
                Category: selectedOption.value
            });
            console.log(res.data);

            const updateRes = await axios.post(`http://localhost:8000/Feedback/COMPLETED/${id}/`, {}, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            console.log(updateRes.data);

            navigate('/completed_requests');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            // Обновление существующего ответа на обратную связь
            const res = await axios.post(`http://localhost:8000/FeedbackResponse/update/${id}/`, {
                Response_theme: theme,
                Response_txt: responseUser,
                feedback: id,
                manager: managerID,
                Category: selectedOption.value // Добавляем категорию в запрос на обновление
            });
            console.log(res.data);
            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    };

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

    useEffect(() => {
        const fetchFeedbackResponse = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/FeedbackResponse/${id}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}` // предполагается, что токен сохраняется в localStorage после входа в систему
                    }
                });
                setTheme(response.data.Response_theme);
                setResponseUser(response.data.Response_txt);
                setEdited(response.data.Edited);
            } catch (error) {
                console.error('Error fetching feedback response: ', error);
            }
        };

        fetchFeedbackResponse();
    }, [id]);

    const BackButton = () => {
        const navigate = useNavigate();
        const onClick = () => {
            navigate(-1);
        };

        return (
            <button className="back-arrow" onClick={handleUpdate}><img src={Arrow}></img></button>
        );
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
                    <Select className="menu-category" placeholder="Определите категорию обращения" options={options} defaultValue={selectedOption} onChange={setSelectedOption} />
                    <p className="answer-appeal">Оставьте ответ на обращение</p>
                    <textarea className="input-answer" type="text" name="name" placeholder="Введите ответ..." value={responseUser} onChange={e => setResponseUser(e.target.value)} />
                    <button className="send-answer" onClick={handleSubmit}>Отправить</button>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Reject_request
