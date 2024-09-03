import React from "react";

class Back extends React.Component {
    onclick() {
       window.location.assign('/appeals');
    }
    render() {
        return (<button className='back-button' onClick={(e) => this.onclick(e)}>Назад</button>)
    }
 }

const Head3 = () => {
    return (
        <React.Fragment>
           <Back/>
        </React.Fragment>
    )
}
export default Head3