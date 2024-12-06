import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartDisplay = ({ chartData }) => {
  useEffect(() => {
    // This ensures that if there's a chart already drawn, it gets properly updated or destroyed
    if (chartData) {
      // Any necessary cleanup or adjustments can go here
    }
  }, [chartData]);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6">Content by Year</Typography>
      {chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Number of Shows per Year',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return tooltipItem.raw + ' shows';
                  },
                },
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default ChartDisplay;
