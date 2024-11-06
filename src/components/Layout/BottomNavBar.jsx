import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListIcon from '@mui/icons-material/List';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToIndex = {
    '/planned-exercises': 0,
    '/add-planned': 0,
    '/workouts': 1,
    '/add-workout': 1,
    '/start-workout': 1,
    '/exercise-logs': 2,
    '/profile': 3,
  };

  const indexToPath = {
    0: '/planned-exercises',
    1: '/workouts',
    2: '/exercise-logs',
    3: '/profile',
  };

  const currentIndex = pathToIndex[location.pathname] || 0; 

  const [value, setValue] = useState(currentIndex);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(indexToPath[newValue]);
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}>
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction label="Exercises" icon={<ListIcon />} />
        <BottomNavigationAction label="Workouts" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Logs" icon={<HistoryIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNavBar;
