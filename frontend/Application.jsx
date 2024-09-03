import React from "react";
import Head2 from "../views/global/global/Head2";
import css from "../styles/Application.css"
import { InputFile } from "../comps/InputFile";
import { useState } from "react";
import woman from '../images/woman(application).png'
import spot from '../images/Пятно(Application).png'

 function Woman() {
 return(
     <img className ="woman" src={woman}></img>
 )
 }

 function Spot() {
    return(
        <img className ="spot" src={spot}></img>
    )
    }

const Application = () => {
    const [photo, setPhoto] = useState(null);
    return (
        <React.Fragment>
            <Head2></Head2>
            <Woman/>
            <Spot/>
            <form className="form2">
                Введите ваше имя и фамилию по желанию<br/>
                    <input className = "input2" type="text" name="name"/>
                Оставьте жалобу или предложение<br/>
                    <textarea className = "input3" type="text" name="application"/>
                Загрузите фото<br/>
                <InputFile accept =".png,.jpg,.jpeg" multiple = {true} files={photo} setFiles={setPhoto}/>
                <button className="send">Отправить заявку</button>
            </form>
        </React.Fragment>
        )
    }
    export default Application