import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box, useTheme } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartDisplay = ({ chartData }) => {
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
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
          },
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

  // Apply gradient to the chart
  const getGradient = () => {
    const chart = chartRef.current;
    if (!chart) return null;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0.2)');
    return gradient;
  };

  const updatedChartData = chartData
    ? {
        ...chartData,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: getGradient(), // Use the gradient as the background color
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 10,
          barThickness: 20,
        })),
      }
    : null;

  return (
    <Box sx={{ marginTop: 0, height: '400px' }}>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, marginBottom: 2 }}>
        Content by Year
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
