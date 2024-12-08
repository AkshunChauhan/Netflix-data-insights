import React from 'react';
import { Box } from '@mui/material';

const Visualizations = () => (
  <Box sx={{ marginTop: 3, width: '100%', height: '300px' }}> 
    <img
      src="http://127.0.0.1:8000/static/genres.png"
      alt="Top Genres Visualization"
      style={{ width: '100%' }}
    />
    <img
      src="http://127.0.0.1:8000/static/ratings.png"
      alt="Content Ratings Visualization"
      style={{ width: '100%' }}
    />
    <img
      src="http://127.0.0.1:8000/static/trend.png"
      alt="Content Addition Trend"
      style={{ width: '100%' }}
    />
  </Box>
);

export default Visualizations;
