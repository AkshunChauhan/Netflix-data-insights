import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider, Box, Grid } from "@mui/material";
import DarkModeSwitch from "./components/DarkModeSwitch";
import Filters from "./components/Filters";
import ChartDisplay from "./components/ChartDisplay";
import PieChartDisplay from "./components/PieChartDisplay";
import Visualizations from "./components/Visualizations";
import ContentTable from "./components/ContentTable";

const App = () => {
  const [contentData, setContentData] = useState([]);
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [matplotlibChart, setMatplotlibChart] = useState(null); // State for Matplotlib chart

  // Fetch available years for filtering (only on initial load)
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/years/");
        setYears(response.data.years);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchAvailableYears();
  }, []);

  // Fetch content data based on filters
  const fetchContentData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/filter/", {
        params: {
          year: yearFilter,
          genre: genreFilter,
        },
      });
      setContentData(response.data.content);
    } catch (error) {
      console.error("Error fetching content data:", error);
    }
  };

  // Fetch all data for the bar chart
  const fetchAllData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/all_data/", {
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
            label: "Number of Shows",
            data: data.barChartData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching all data for chart:", error);
    }
  };

  // Fetch country data for pie chart
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/country_data/",
          {
            params: {
              year: yearFilter,
            },
          }
        );
        setCountryData({
          labels: response.data.labels,
          datasets: [
            {
              data: response.data.data,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };
    fetchCountryData();
  }, [yearFilter]);

  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/type_data/", {
          params: {
            year: yearFilter,
          },
        });
        setTypeData({
          labels: response.data.labels,
          datasets: [
            {
              data: response.data.data,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching type data:", error);
      }
    };
    fetchTypeData();
  }, [yearFilter]);

  // Fetch Matplotlib chart based on filters
  const fetchMatplotlibChart = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/matplotlib_chart/", {
        params: {
          year: yearFilter,
          genre: genreFilter,
        },
      });
      setMatplotlibChart(`data:image/png;base64,${response.data.chart}`);
    } catch (error) {
      console.error("Error fetching Matplotlib chart:", error);
    }
  };

  // Handle filter changes
  const handleYearChange = (event) => setYearFilter(event.target.value);
  const handleGenreChange = (event) => setGenreFilter(event.target.value);

  // Handle filter button click
  const handleFilterClick = () => {
    fetchContentData();
    fetchAllData();
    fetchMatplotlibChart(); // Fetch the Matplotlib chart
  };

  // Create the theme based on the mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          maxWidth: "2000px", // Limit the maximum width of your content
          mx: "auto", // Automatically set equal left and right margins
          px: 2, // Add some padding for small screens
        }}
      >
        <Grid container spacing={2}>
          {/* Left Section (Pie Charts) */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <PieChartDisplay
                title="Content by Country"
                pieData={countryData}
                sx={{ height: 100, width: 100 }} // Control size of the chart
              />
              <PieChartDisplay
                title="Content by Type"
                pieData={typeData}
                sx={{ height: 100, width: 100 }} // Control size of the chart
              />
            </Box>
          </Grid>

          {/* Center Section (Filters, Bar Chart, Matplotlib Chart, and Table) */}
          <Grid item xs={12} md={6}>
            <DarkModeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
            <Filters
              yearFilter={yearFilter}
              genreFilter={genreFilter}
              years={years}
              handleYearChange={handleYearChange}
              handleGenreChange={handleGenreChange}
              handleFilterClick={handleFilterClick}
            />
            {/* Bar Chart */}
            <ChartDisplay chartData={chartData} />
            {/* Matplotlib Chart */}
            {/* {matplotlibChart && (
              <Box>
                <h3>Matplotlib Chart</h3>
                <img src={matplotlibChart} alt="Matplotlib Chart" style={{ width: "100%" }} />
              </Box>
            )} */}
            {/* Content Table */}
            <ContentTable contentData={contentData} />
          </Grid>

          {/* Right Section (Visualizations) */}
          <Grid item xs={12} md={3}>
            <Visualizations />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;
