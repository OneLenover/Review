import React from "react";
import css from '../../src/styles/Login.css'

const InputComponent = (props) => {
    const { placeholder } = props
    return (
        <React.Fragment>
            <input className="input-login"
            type = {"text"}
            placeholder = {placeholder}
            maxLength = {"100"}
            />
        </React.Fragment>
        )
    }
    export default InputComponent