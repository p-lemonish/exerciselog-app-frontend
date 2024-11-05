import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Workouts() {
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddWorkout = () => {
    navigate('/add-workout');
  };
  const handleEditWorkout = async (id) => {
    navigate(`/edit-workout/${id}`);
  };
  const handleDeleteWorkout = async (id) => {
    try {
      await api.delete(`/workouts/delete-planned/${id}`);
      fetchPlannedWorkouts();
      setError(null);
    } catch (err) {
      console.error('Error deleting planned workout', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.entries(errorData).map(
          ([field, message]) => `${message}`
        );
        setError(errorMessages);
      }
    }
  };
  const handleStartWorkout = async (id) => {
    navigate(`/start-workout/${id}`);
  };
  const fetchPlannedWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setPlannedWorkouts(response.data);
    } catch (err) {
      console.error('Error fetching planned exercises', err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to load planned workouts');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedWorkouts();
  }, [authState.token, logout, navigate]);

  if (loading)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Planned Workouts
      </Typography>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddWorkout}
        fullWidth>
        Plan a New Workout
      </Button>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {plannedWorkouts.length === 0 ? (
        <Typography variant="body1">No planned workouts found</Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {plannedWorkouts.map((workout) => (
            <React.Fragment key={workout.id}>
              <ListItem
                onClick={() => handleStartWorkout(workout.id)}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="start"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWorkout(workout.id);
                      }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkout(workout.id);
                      }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }>
                <ListItemText primary={workout.workoutName} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      <Box sx={{ height: '80px' /* fix for navbar getting no padding */ }} />
    </Container>
  );
}
export default Workouts;
