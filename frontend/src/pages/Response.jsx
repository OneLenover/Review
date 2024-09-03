import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Popup from 'reactjs-popup';

function Response() {
    const { id } = useParams();
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const [managerID, setManagerID] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/FeedbackResponse/', {
                Response_txt: response,
                feedback: id,
                manager: managerID
            });
            console.log(res.data);
        }catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8000')
            .then(response => {
                const feedbackById = response.data.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                }, {});
                setText(feedbackById[id].Feedback_txt);
            })

            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [id]);

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

    return (
        <div>
            <h2>Текст обратной связи:</h2>
            <p>{text}</p>
            <form onSubmit={handleSubmit}>
                <textarea className = "input" type="text" name="response" value={response} onChange={e => setResponse(e.target.value)}/>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}

export default Response;
