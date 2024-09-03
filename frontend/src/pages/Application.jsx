import React from "react";
import Head2 from "../views/global/global/Head2";
import css from "../styles/Application.css";
import { InputFile } from "../comps/InputFile";
import { useState, useEffect } from "react";
import copy from '../images/копирование.png';
import Popup from 'reactjs-popup';
import appl from '../images/обращение.png';
import axios from 'axios';
import { MdFileDownload } from "react-icons/md";
import plane from '../images/plane1.png';

function Appl() {
    return (
        <img className="appl" src={appl}></img>
    );
}

class Main extends React.Component {
    onclick() {
        window.location.assign('/');
    }
    render() {
        return (
            <button className="main" onClick={(e) => this.onclick(e)}>
                На главную
            </button>
        );
    }
}

const Application = () => {
    const [images, setImages] = useState([]);
    const [application, setApplication] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [name, setName] = useState("");
    const [verificationKey, setVerificationKey] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Сначала создаем Feedback
            const feedbackResponse = await axios.post('http://127.0.0.1:8000/', {
                Feedback_name: name || "Anonymous",
                Feedback_txt: application
            });
            console.log(feedbackResponse.data);
            setInputValue(feedbackResponse.data.verification_key);

            // Теперь у нас есть id для Feedback, который мы можем использовать для ImageAttachment
            const feedbackId = feedbackResponse.data.id; // Убедитесь, что ваш API возвращает id созданного Feedback

            // Теперь создаем ImageAttachment с id Feedback
            const formData = new FormData();
            for (let i = 0; i < images.length; i++) {
                formData.append('image', images[i]);
            }
            formData.append('feedback', feedbackId); // Добавляем id Feedback
            const imageResponse = await axios.post(`http://127.0.0.1:8000/Images/${feedbackId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(imageResponse.data);
        } catch (error) {
            console.error(error);
        }
    };

    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        // Добавляем класс к body при монтировании компонента
        document.body.classList.add('application-background');

        // Удаляем класс с body при размонтировании компонента
        return () => {
            document.body.classList.remove('application-background');
        };
    }, []);

    function closeModal() {
        document.querySelector('.modal').style.display = 'none';
    }

    return (
        <React.Fragment>
            <div className="container_fon">
			<Head2/>
                <form className="form_application" onSubmit={handleSubmit}>
                    <div className="form_right">
                        <p className="text_form">Введите ваше имя и фамилию по желанию</p>
                        <input className="input2" type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
                        <p className="text_form">Оставьте жалобу или предложение</p>
                        <textarea className="text_input" type="text" name="application" value={application} onChange={e => setApplication(e.target.value)} />
                        <div className="file-upload-container">
                            <span className="text_form">Загрузите фото(максимум 3 фото)</span>
                            <label className="file-upload-label">
                                <MdFileDownload className="input-file-icon" />
                                <InputFile accept=".png,.jpg,.jpeg" multiple={true} files={photo} setFiles={setPhoto} />
                            </label>
                        </div>
                        <Popup trigger={
                            <button type="submit" className="send">Отправить заявку</button>
                        }
                            modal nested>
                            {
                                <div className='modal'>
                                    <div className='content'>
                                        <button className="close-application" onClick={closeModal}>×</button>
                                        <img src={plane} alt="plane" className="modal-image" />
                                        Спасибо за заявку!<br />
                                        Ваш ключ для просмотра обратной связи!
                                        <div className="d1">
                                            <div id="textbox">{inputValue}</div> {/* Вставляем inputValue здесь */}
                                            <button className="Copy" onClick={() => { navigator.clipboard.writeText(inputValue) }}>
                                                <img src={copy} width="40vw" height="40vw" alt="Copy" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            }
                        </Popup>
                    </div>
                    <div className="form_left">
                        <label className="icon">SecretVoice</label>
                        <Appl />
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Application;
