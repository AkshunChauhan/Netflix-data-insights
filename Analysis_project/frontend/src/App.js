import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [contentData, setContentData] = useState([]);
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

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
  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenreFilter(event.target.value);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    fetchContentData();
    fetchAllData();
  };

  return (
    <div className="App">
      <h1>Netflix Content Data</h1>

      {/* Filter Options */}
      <div className="filter-container" style={styles.filterContainer}>
        <label htmlFor="year-filter">Filter by Year:</label>
        <select id="year-filter" value={yearFilter} onChange={handleYearChange} style={styles.select}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="genre-filter">Filter by Genre:</label>
        <input
          type="text"
          id="genre-filter"
          value={genreFilter}
          onChange={handleGenreChange}
          placeholder="Enter Genre"
          style={styles.input}
        />
        
        {/* Filter Button */}
        <button onClick={handleFilterClick} style={styles.button}>Filter</button>
      </div>

      {/* Bar Chart */}
      <h2>Content by Year</h2>
      {chartData && (
        <div style={styles.chartContainer}>
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
        </div>
      )}

      {/* Visualizations - Images */}
      <div className="visualizations" style={styles.visualizations}>
        <img src="http://127.0.0.1:8000/static/genres.png" alt="Top Genres Visualization" style={styles.image} />
        <img src="http://127.0.0.1:8000/static/ratings.png" alt="Content Ratings Visualization" style={styles.image} />
        <img src="http://127.0.0.1:8000/static/trend.png" alt="Content Addition Trend" style={styles.image} />
      </div>

      {/* Content Table */}
      <h2>Filtered Content</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Release Year</th>
            <th>Rating</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {contentData.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.release_year}</td>
              <td>{item.rating}</td>
              <td>{item.listed_in}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Inline styles in JavaScript object format
const styles = {
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  select: {
    margin: '10px',
    padding: '10px',
    fontSize: '1rem',
    minWidth: '200px',
  },
  input: {
    margin: '10px',
    padding: '10px',
    fontSize: '1rem',
    minWidth: '200px',
  },
  button: {
    margin: '10px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  chartContainer: {
    width: '100%',
    maxWidth: '1000px',
    margin: 'auto',
  },
  visualizations: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '30px',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  image: {
    width: '30%',
    maxWidth: '600px',
    height: 'auto',
    margin: '10px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
};

// Add media queries for responsiveness
const mediaQueryStyles = {
  '@media (max-width: 768px)': {
    filterContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    visualizations: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    image: {
      width: '80%',
    },
    chartContainer: {
      width: '90%',
    },
  },
};

export default App;
