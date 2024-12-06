import React from 'react';
import { Box } from '@mui/material';

const Visualizations = () => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, marginTop: 4 }}>
    <img src="http://127.0.0.1:8000/static/genres.png" alt="Top Genres Visualization" style={{ width: '30%' }} />
    <img src="http://127.0.0.1:8000/static/ratings.png" alt="Content Ratings Visualization" style={{ width: '30%' }} />
    <img src="http://127.0.0.1:8000/static/trend.png" alt="Content Addition Trend" style={{ width: '30%' }} />
  </Box>
);

export default Visualizations;
