import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MatplotlibChart = ({ year, genre }) => {
  const [chart, setChart] = useState('');

  useEffect(() => {
    // Fetch the chart from the Django backend
    const fetchChart = async () => {
      try {
        const response = await axios.get('/matplotlib_chart/', {
          params: { year, genre },
        });
        setChart(response.data.chart);
      } catch (error) {
        console.error('Error fetching the chart:', error);
      }
    };

    fetchChart();
  }, [year, genre]);

  return (
    <div>
      <h3>Matplotlib Chart</h3>
      {chart ? (
        <img src={`data:image/png;base64,${chart}`} alt="Filtered Matplotlib Chart" />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default MatplotlibChart;
