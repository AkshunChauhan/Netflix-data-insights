import React from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';

const DarkModeSwitch = ({ darkMode, setDarkMode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
      label="Dark Mode"
    />
  </Box>
);

export default DarkModeSwitch;
