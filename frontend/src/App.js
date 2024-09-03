import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch  } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Application from './pages/Application';
import New_requests from './pages/New_requests';
import Requests_in_work from './pages/Requests_in_work';
import Completed_requests from './pages/Completed_requests';
import Appeals from './pages/Appeals';
import Response from './pages/Response';
import FeedBack from './pages/FeedBack';
import ReadAppeal from './pages/Read_appeal';
import Check_answer from './pages/FeedBack';
import RejectRequest from './pages/Reject_request';
import CheckCompleted from './pages/Check_completed_request';
import Answer from './pages/Answer';
import ChartComponent from './pages/ChartComponent';
import ReadRequest from './pages/Read_request';
import Statistics from './pages/Statistics';
import SearchSameNew from './pages/Search_same_new';
import AnswerMult from './pages/AnswerMult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> //Главная страница
        <Route path="/login" element={<Login />} /> //Логин пароль
        <Route path="/application" element={<Application />} /> //Написать обращение
        <Route path="/appeals" element={<Appeals />} /> //Новые, в работе, завершенные
        <Route path="/new_requests" element={<New_requests />} /> //Новые обращения
        <Route path="/requests_in_work" element={<Requests_in_work />} /> //Ообращение в работе
        <Route path="/completed_requests" element={<Completed_requests />} /> //Завершенные в работе
        <Route path="/response/:id" element={<Response />} />
        <Route path="/FeedBack" element={<FeedBack />} /> //
        <Route path="/Feedback/:key" element={<Check_answer />} /> //Ответ на обращение
        <Route path="/ReadAppeal/:id" element={<ReadAppeal />} /> //Прочитать обращение
        <Route path="/RejectRequest/:id" element={<RejectRequest />} /> //Причина отклоения
        <Route path="/CheckCompleted/:id" element={<CheckCompleted />} /> //Проверить ответ
        <Route path="/Answer/:id" element={<Answer />} />
        <Route path="/ChartComponent" element={<ChartComponent />} />
        <Route path="/ReadRequest/:id" element={<ReadRequest />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/SearchSameNew" element={<SearchSameNew />} />
        <Route path="/AnswerMult" element={<AnswerMult />} />
      </Routes>
    </Router>
  );
}

export default App;
