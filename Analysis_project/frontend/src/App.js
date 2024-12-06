import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider, Box, Container } from '@mui/material';
import DarkModeSwitch from './components/DarkModeSwitch';
import Filters from './components/Filters';
import ChartDisplay from './components/ChartDisplay';
import Visualizations from './components/Visualizations';
import ContentTable from './components/ContentTable';

const App = () => {
  const [contentData, setContentData] = useState([]);
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Fetch available years for filtering (only on initial load)
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/years/');
        setYears(response.data.years);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    fetchAvailableYears();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch content data based on filters
  const fetchContentData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/filter/', {
        params: {
          year: yearFilter,
          genre: genreFilter,
        },
      });
      setContentData(response.data.content);
    } catch (error) {
      console.error('Error fetching content data:', error);
    }
  };

  // Fetch all data for the bar chart
  const fetchAllData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/all_data/', {
        params: {
          year: yearFilter,
          genre: genreFilter,
        },
      });
      const data = response.data;
      setChartData({
        labels: data.barChartLabels,
        datasets: [
          {
            label: 'Number of Shows',
            data: data.barChartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching all data for chart:', error);
    }
  };

  // Handle filter changes
  const handleYearChange = (event) => setYearFilter(event.target.value);
  const handleGenreChange = (event) => setGenreFilter(event.target.value);

  // Handle filter button click
  const handleFilterClick = () => {
    fetchContentData();
    fetchAllData();
  };

  // Create the theme based on the mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Container>
          <DarkModeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
          <Filters
            yearFilter={yearFilter}
            genreFilter={genreFilter}
            years={years}
            handleYearChange={handleYearChange}
            handleGenreChange={handleGenreChange}
            handleFilterClick={handleFilterClick}
          />
          <ChartDisplay chartData={chartData} />
          <Visualizations />
          <ContentTable contentData={contentData} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
