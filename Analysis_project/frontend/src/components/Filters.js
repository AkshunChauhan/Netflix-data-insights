import React from 'react';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Box } from '@mui/material';

const Filters = ({ yearFilter, genreFilter, years, handleYearChange, handleGenreChange, handleFilterClick }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 2, 
      marginBottom: 3 
    }}
  >
    <FormControl sx={{ width: 200 }}>
      <InputLabel>Filter by Year</InputLabel>
      <Select value={yearFilter} onChange={handleYearChange}>
        <MenuItem value="">Select Year</MenuItem>
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Filter by Genre"
      value={genreFilter}
      onChange={handleGenreChange}
      sx={{ width: 200 }}
      variant="outlined"
    />

    <Button variant="contained" onClick={handleFilterClick}>
      Filter
    </Button>
  </Box>
);

export default Filters;
