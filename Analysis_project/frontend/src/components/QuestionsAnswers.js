import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

const QuestionsAnswers = () => {
  const [topGenre, setTopGenre] = useState(null);
  const [topRating, setTopRating] = useState(null);
  const [topTrend, setTopTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch most common genres
        const genresResponse = await axios.get("http://127.0.0.1:8000/api/most_common_genres/");
        setTopGenre(genresResponse.data.genres[0]); // Get the top genre

        // Fetch content distribution by ratings
        const ratingsResponse = await axios.get("http://127.0.0.1:8000/api/content_by_ratings/");
        setTopRating(ratingsResponse.data.ratings[0]); // Get the top rating

        // Fetch trend of additions
        // const trendResponse = await axios.get("http://127.0.0.1:8000/api/additions_trend/");
        // setTopTrend(trendResponse.data.trend[0]); 
        // Get the top trend entry

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Card for Question 1: Most Common Genre */}
      <Card>
        <CardContent>
          <Typography variant="h7" gutterBottom style={{ fontWeight: "bold" }}>
            What is the most common genre on Netflix?
          </Typography>
          {topGenre ? (
            <Typography>{`${topGenre[0]}: ${topGenre[1]} shows`}</Typography>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Card for Question 2: Content Distribution by Ratings */}
      <Card>
        <CardContent>
          <Typography variant="h7" gutterBottom style={{ fontWeight: "bold" }}>
            What is the most common content rating?
          </Typography>
          {topRating ? (
            <Typography>{`${topRating.rating || "Unrated"}: ${topRating.count}`}</Typography>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Card for Question 3: Trend of Additions */}
      {/* <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            In which year was the most content added?
          </Typography>
          {topTrend ? (
            <Typography>{`Year ${topTrend.release_year}: ${topTrend.count} additions`}</Typography>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </CardContent>
      </Card> */}
    </Box>
  );
};

export default QuestionsAnswers;
