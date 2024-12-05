import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [content, setContent] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreGraph, setGenreGraph] = useState("");
  const [ratingsGraph, setRatingsGraph] = useState("");
  const [trendGraph, setTrendGraph] = useState("");
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [filteredData, setFilteredData] = useState(null); // Store filtered data for highlighting

  // Fetch data when the component mounts
  useEffect(() => {
    // Fetch available years
    axios
      .get("http://127.0.0.1:8000/years/")
      .then((response) => {
        setYears(response.data.years);
      })
      .catch((error) => {
        console.error("Error fetching years:", error);
      });

    // Fetch initial graphs
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        setGenreGraph(response.data.genres_graph);
        setRatingsGraph(response.data.ratings_graph);
        setTrendGraph(response.data.trend_graph);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Fetch data for all years by default
    axios
      .get("http://127.0.0.1:8000/all_data/", {
        params: {
          year: "", // Default no year filter
          genre: "", // Default no genre filter
        },
      })
      .then((response) => {
        // Setup initial data for all years
        setBarChartData({
          labels: response.data.barChartLabels, // All years
          datasets: [
            {
              label: "Total Shows by Year (All Data)",
              data: response.data.barChartData, // Total shows per year (all years)
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Light color for all years
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
      });
  }, []);

  // Function to handle filter and update the graph
  const filterContent = () => {
    axios
      .get("http://127.0.0.1:8000/all_data/", {
        params: { year: selectedYear, genre: selectedGenre },
      })
      .then((response) => {
        // Extract filtered and all data
        const filteredBarData = response.data.barChartData;
        const allBarData = response.data.barChartDataAll;

        // Set the content based on the filter
        setContent(response.data.content);

        // Update the graph with both the overall and filtered data
        setBarChartData({
          labels: response.data.barChartLabels, // Filtered years
          datasets: [
            {
              label: "Total Shows by Year (All Data)",
              data: allBarData, // All shows data (for all years)
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Light color for all years
            },
            {
              label: "Filtered Total Shows",
              data: filteredBarData, // Filtered data
              backgroundColor: "rgba(255, 99, 132, 0.6)", // Highlighted color for filtered data
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching filtered content:", error);
      });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Netflix Content</h1>

      {/* Graphs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={genreGraph}
          alt="Genre Graph"
          style={{ maxWidth: "300px", height: "auto" }}
        />
        <img
          src={ratingsGraph}
          alt="Ratings Graph"
          style={{ maxWidth: "300px", height: "auto" }}
        />
        <img
          src={trendGraph}
          alt="Trend Graph"
          style={{ maxWidth: "300px", height: "auto" }}
        />
      </div>

      {/* Filter Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Dropdown for selecting year */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "16px" }}
        >
          <option value="">Select Year</option>
          {years && years.length > 0 ? (
            years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))
          ) : (
            <option disabled>No years available</option>
          )}
        </select>

        {/* Dropdown for selecting genre */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "16px" }}
        >
          <option value="">Select Genre</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          {/* Add more genres as needed */}
        </select>

        {/* Button to apply filters */}
        <button
          onClick={filterContent}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Filter Content
        </button>
      </div>

      {/* Bar Chart for Total Shows per Year */}
      <div style={{ marginTop: "40px" }}>
        <h2>Total Shows per Year</h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Total Shows per Year",
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Year",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Total Shows",
                },
              },
            },
          }}
        />
      </div>

      {/* Table to display filtered content */}
      <div>
        <h2>Filtered Content</h2>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "500px",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Title
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Release Year
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Rating
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Genres
                </th>
              </tr>
            </thead>
            <tbody>
            {content && content.length > 0 ? (
              content.map((item) => (
                <tr key={item.title}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.title}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.type}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.release_year}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.rating}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.genres.join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                  No content available
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;