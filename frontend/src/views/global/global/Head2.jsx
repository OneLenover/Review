import React from "react";
import Arrow from '/Users/loris/Desktop/WebServer/frontend/src/images/Стрелка_назад.png' //Путь измени 

class Back_button extends React.Component {
    onclick() {
        window.location.assign('/');
    }
    render() {
        return (<button className='login' onClick={(e) => this.onclick(e)}><img src={Arrow}></img></button>)
    }
}  

const Head2 = () => {
    return (
        <React.Fragment>
            <Back_button/>
        </React.Fragment>
    )
}
export default Head2