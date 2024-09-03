import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "../styles/ChartComponent.css";
import Head3 from '../views/global/global/Head3';
import axios from 'axios'

const ChartComponent = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  const database = [
    { date: '2024-05-19', count: 20 },
    { date: '2024-05-20', count: 10 },
    { date: '2024-05-18', count: 0 },
    { date: '2024-05-10', count: 1 },
    { date: '2024-05-08', count: 2 },
  ];

  useEffect(() => {
      fetch('http://127.0.0.1:8000/')
        .then(response => response.json())
        .then(data => {
          const groupedData = data.reduce((acc, feedback) => {
            const date = feedback.Feedback_date;
            if (!acc[date]) {
              acc[date] = 0;
            }
            acc[date]++;
            return acc;
          }, {});

          const chartData = Object.keys(groupedData).map(date => ({
            date,
            count: groupedData[date]
          }));

          setData(chartData);
        });
    }, []);

  useEffect(() => {
    if (data.length > 0) {
      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.date),
          datasets: [{
            label: 'Обращения по дням',
            data: data.map(item => item.count),
            borderColor: 'rgba(169, 169, 255, 1)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointHoverBackgroundColor: '#fff',
          }]
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: data.map(item => item.date), 
            },
            y: {
              beginAtZero: true /*ось Y начинается с нулевого значения */
            }
          }
        }
      });
    }
  }, [data]);

  return (
    <div className="chart-container">
        <Head3/>
      <h2 className="chart-title">Статистика обращений по дням</h2>
      <div className="canvas-container">
        <canvas id="myChart" className="chart"></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;