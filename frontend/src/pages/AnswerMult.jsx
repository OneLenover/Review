import React, { useState, useEffect } from "react";
import '../styles/Answer.css';
import Arrow from '../images/Стрелка_назад.png';
import Menu from '../comps/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const AnswerMult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedIds = [] } = location.state || {};
    const [theme, setTheme] = useState("");
    const [responseUser, setResponseUser] = useState("");
    const [managerID, setManagerID] = useState();
    const [selectedOption, setSelectedOption] = useState({ value: 'Без категории', label: 'Без категории' });

    const options = [
        { value: 'Без категории', label: 'Без категории' },
        { value: 'Кадровые вопросы', label: 'Кадровые вопросы' },
        { value: 'Техническая поддержка', label: 'Техническая поддержка' },
        { value: 'Организация работы', label: 'Организация работы' },
        { value: 'Административные вопросы', label: 'Административные вопросы' },
        { value: 'Финансовые вопросы', label: 'Финансовые вопросы' },
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("HandleSubmit triggered");
        try {
            for (const id of selectedIds) {
                console.log(`Sending response for feedback ID: ${id}`);
                const response = await axios.post(`http://localhost:8000/FeedbackResponse/update/${id}/`, {
                    Response_theme: theme || "none",
                    Response_txt: responseUser || "none",
                    feedback: id,
                    manager: managerID,
                    Category: selectedOption.value
                });
                console.log(`Response for feedback ID ${id}:`, response.data);

                const completeResponse = await axios.post(`http://localhost:8000/Feedback/COMPLETED/${id}/`, {}, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                console.log(`Completed feedback ID ${id}:`, completeResponse.data);
            }

            navigate('/completed_requests');
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    };

    useEffect(() => {
        const fetchManagerID = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get_manager_id/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                setManagerID(response.data.managerID);
                console.log("Manager ID fetched:", response.data.managerID);
            } catch (error) {
                console.error('Error fetching manager ID: ', error);
            }
        };

        fetchManagerID();
    }, []);

    useEffect(() => {
        console.log('Location state:', location.state);
    }, [location.state]);

    const BackButton = () => {
        const onClick = () => {
            navigate('/SearchSameNew');
        };

        return (
            <button className="back-arrow" onClick={onClick}><img src={Arrow} alt="Back" /></button>
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
    );
};

export default AnswerMult;
