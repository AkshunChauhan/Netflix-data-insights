import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useTheme, Box, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartDisplay = ({ title, pieData }) => {
  const theme = useTheme();

  // Check if pieData is null or if it contains empty labels/data
  const isDataAvailable =
    pieData &&
    pieData.labels &&
    pieData.labels.length > 0 &&
    pieData.datasets &&
    pieData.datasets[0].data.length > 0;

  if (!isDataAvailable) {
    return <div>No data available for {title}</div>;
  }

  // Get the top 3 data entries
  const sortedData = pieData.datasets[0].data
    .map((data, index) => ({ label: pieData.labels[index], data }))
    .sort((a, b) => b.data - a.data)
    .slice(0, 3);

  const topLabels = sortedData.map((item) => item.label);
  const topData = sortedData.map((item) => item.data);

  // Create a new pieData with top 3 entries
  const filteredPieData = {
    ...pieData,
    labels: topLabels,
    datasets: [
      {
        ...pieData.datasets[0],
        data: topData,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable the default aspect ratio
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
  };

  return (
    <Box sx={{ marginTop: 3, width: '100%', height: '300px' }}> {/* Set container dimensions */}
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, marginBottom: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: '100%' }}> {/* Chart container */}
        <Pie data={filteredPieData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default PieChartDisplay;
