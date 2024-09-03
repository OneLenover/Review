import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import axios from 'axios';

const COLORS = ['#3575D8', '#F0A523', '#A5A5FD', '#FF9C9C', '#8BB5F5'];

const getColor = (category) => {
    switch (category) {
        case 'Кадровые вопросы': return '#3575D8';
        case 'Техническая поддержка': return '#F0A523';
        case 'Организация работы': return '#A5A5FD';
        case 'Административные вопросы': return '#FF9C9C';
        case 'Финансовые вопросы': return '#8BB5F5';
        default: return '#8884d8';
    }
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        const percent = ((value / total) * 100).toFixed(2);

        return (
            <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                <p>{`${name}: ${value} (${percent}%)`}</p>
            </div>
        );
    }

    return null;
};

const DonutChart = ({ startDate, endDate }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/CategoryCount/')
            .then(response => {
                setData(response.data.map(item => ({
                    name: item.Category,
                    value: item.count,
                    color: getColor(item.Category)
                })));
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = (start, end) => {
        const filteredData = data.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= start && entryDate <= end;
        });
        setData(filteredData);
    };

    return (
        <div style={{ width: 374, height: 250, backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Категории обращений</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <PieChart width={150} height={150}>
                    <Pie
                        data={data}
                        cx={75}
                        cy={75}
                        labelLine={false}
                        outerRadius={60}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
                <div style={{ marginLeft: '20px' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {data.map((entry, index) => (
                            <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: entry.color, marginRight: '8px' }}></span>
                                <span>{entry.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
