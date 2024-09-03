import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ startDate, endDate }) => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/')
            .then(response => {
                const feedbackData = response.data;
                const data = feedbackData.reduce((acc, feedback) => {
                    const date = new Date(feedback.Feedback_date).toISOString().split('T')[0];
                    const start = startDate ? startDate.toISOString().split('T')[0] : null;
                    const end = endDate ? endDate.toISOString().split('T')[0] : null;

                    if ((!start || date >= start) && (!end || date <= end)) {
                        acc[date] = (acc[date] || 0) + 1;
                    }

                    return acc;
                }, {});

                const records = Object.keys(data).map(date => ({
                    date,
                    count: data[date],
                }));

                setFilteredData(records);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [startDate, endDate]);

    const data = {
        labels: filteredData.map(entry => entry.date),
        datasets: [
            {
                label: 'Количество обращений по дням',
                data: filteredData.map(entry => entry.count),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div
            style={{
                width: '840px',
                height: '480px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
            }}
        >
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
