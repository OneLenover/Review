import React, { useEffect} from "react";
import Login from "../../../pages/Login";
import axios from 'axios';

function Help() {
    const openPdf = () => {
      window.open('https://docs.google.com/document/d/1V1fzn_Bw1AShpsle3-VLvSVQj6aayj3gd1ECNzDrccU/edit?usp=sharingЫ', '_blank');
    };
    return (
      <button className='help' onClick={openPdf}>
        Помощь
      </button>
    );
  }
class LogIn extends React.Component {
   onclick() {
      window.location.assign('/login');
   }
   render() {
       return (<button className='logIn' onClick={(e) => this.onclick(e)}>Вход</button>)
   }
}
const Head = () => {
    return (
        <React.Fragment>
            <Help/>
            <LogIn/>
        </React.Fragment>
    )
}
export default Head