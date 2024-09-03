import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Card1 = ({ startDate, endDate }) => {
    const [dailyRequests, setDailyRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8000/')
            .then(response => {
                const feedbackData = response.data;
                const data = feedbackData.reduce((acc, feedback) => {
                    const date = new Date(feedback.Feedback_date).toISOString().split('T')[0];
                    if (startDate && endDate) {
                        if (date >= startDate.toISOString().split('T')[0] && date <= endDate.toISOString().split('T')[0]) {
                            acc[date] = (acc[date] || 0) + 1;
                        }
                    } else {
                        acc[date] = (acc[date] || 0) + 1;
                    }
                    return acc;
                }, {});

                const records = Object.keys(data).map(date => ({
                    date,
                    count: data[date],
                }));

                setDailyRequests(records);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rejectedRes = await axios.get('http://localhost:8000/Feedback/status/REJECTED/', {
                    params: { start_date: startDate?.toISOString().split('T')[0], end_date: endDate?.toISOString().split('T')[0] }
                });
                setRejectedRequests(rejectedRes.data.length);
            } catch (error) {
                console.error('Ошибка при получении отклоненных обращений: ', error);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const data = {
        labels: dailyRequests.map(day => day.date),
        datasets: [
            {
                data: dailyRequests.map(day => day.count),
                fill: true,
                backgroundColor: 'rgba(255, 234, 209, 0.2)',
                borderColor: '#F3CFBA',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                display: false,
            },
            x: {
                display: false,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
        layout: {
            padding: 0,
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', width: '207px', height: '250px', textAlign: 'center', backgroundColor: '#fff' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px', marginTop: '20px' }}>
                <span style={{ color: '#F49981' }}>−</span>
            </div>
            <div style={{ fontSize: '30px', marginBottom: '29px' }}>{rejectedRequests}</div>
            <div style={{ fontSize: '15px', color: '#5A5A65' }}>Обращений отклонено</div>
            <div style={{ marginTop: '20px', height: '100px', width: '100%', padding: 0 }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default Card1;
