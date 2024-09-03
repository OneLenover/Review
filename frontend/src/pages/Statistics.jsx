import React, { useState } from 'react';
import Menu from "../comps/Menu.jsx";
import Card from "../pages/Card.jsx";
import Card1 from "../pages/Card1.jsx";
import LineChart from '../pages/LineChart.jsx';
import DonutChart from '../pages/DonutChart.jsx';
import '../styles/Statistics.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Statistics = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <div className="dashboard">
            <Menu />
            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    dateFormat="dd.MM.yyyy"
                    customInput={<CustomInput />}
                />
            </div>
            <div className="top-row">
                <div className="left1">
                    <Card startDate={startDate} endDate={endDate} />
                </div>
                <div className="left2">
                    <Card1 startDate={startDate} endDate={endDate} />
                </div>
                <div className="left3">
                    <DonutChart />
                </div>
            </div>
            <div className="left4">
                <LineChart />
            </div>
        </div>
    );
};

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
        value={value}
        onClick={onClick}
        ref={ref}
        style={{ width: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
        placeholder="Введите диапазон дат"
    />
));

export default Statistics;
