import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ chartData, chartLabels }) => {
  // Define the data for the chart using props
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Details in chart',
        data: chartData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Define options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

 
  return (
    <div style={{ width: '900px', height: '650px' }}>
      <Bar data={data} options={options} />
    </div>
  );

};

export default BarChart;
