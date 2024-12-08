import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box, useTheme } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ChartDisplay = ({ chartData, trendData }) => {
  const theme = useTheme();
  const chartRef = useRef(null); // Reference to the chart instance

  // Dynamically update chart options based on theme mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Number of Shows per Year',
        color: theme.palette.text.primary,
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} shows`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  // Generate unique colors for each bar
  const generateColors = (count) => {
    const colors = [
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const updatedChartData = chartData
    ? {
        ...chartData,
        datasets: [
          // Bar chart dataset
          {
            ...chartData.datasets[0],
            backgroundColor: generateColors(chartData.datasets[0].data.length), // Use dynamic colors
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderRadius: 5,
            barThickness: 30, // Set bar thickness
          },
          // Line chart dataset (trend line)
          {
            type: 'line',
            label: 'Trend Line',
            data: chartData.datasets[0].data, // Use bar data for the line
            fill: false,
            borderColor: 'rgba(255, 159, 64, 1)', // Color of the trend line
            borderWidth: 2,
            tension: 0.4, // Controls the smoothness of the line
            pointRadius: 3, // Size of points on the line
            pointBackgroundColor: 'rgba(255, 159, 64, 1)', // Point color
            pointBorderColor: 'rgba(255, 159, 64, 1)', // Point border color
            borderJoinStyle: 'round', // Ensure smooth connection
          },
        ],
      }
    : null;

  return (
    <Box sx={{ marginTop: 2, height: '500px' }}>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, marginBottom: 2 }}>
      </Typography>
      {updatedChartData && (
        <Bar
          data={updatedChartData}
          options={chartOptions}
          ref={chartRef} // Attach the chart instance to the ref
        />
      )}
    </Box>
  );
};

export default ChartDisplay;
