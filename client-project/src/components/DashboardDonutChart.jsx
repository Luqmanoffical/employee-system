import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-data');
        const data = await response.json();
     console.log(data);
        setChartData({
          labels: ['Invoices', 'Customers', 'Pending','employee_task' , 'vehicles'],
          datasets: [
            {
              data: [data.invoices, data.customers, data.pending ,data.employee_task ,data.vehicles ],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#00FF00','#DC143C'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#00FF00','#DC143C'],
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='bg-gray-100 pt-20' style={{ width: '100%', margin: '0 auto' }}>
      
      <div style={{ width: '50%', margin: '0 auto' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Doughnut data={chartData} />
      )}

      </div>
     
    </div>
  );
};

export default DashboardChart;
