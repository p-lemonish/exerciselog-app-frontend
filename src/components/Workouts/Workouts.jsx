import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
  ListItemButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingScreen from '../LoadingScreen';
import PageLayout from '../Layout/PageLayout';
import handleApiError from '../ErrorHandler'

function Workouts() { // TODO Let user change the order of their planned exercises in planned workout
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('');
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
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    }
  };
  const handleStartWorkout = async (id) => {
    navigate(`/start-workout/${id}`);
  };
  const fetchPlannedWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setPlannedWorkouts(response.data);
      const uniqueNames = [
        ...new Set(
          response.data
            .map((workout) => workout.workoutName)
            .filter((name) => name != null)
        ),
      ];
      setWorkoutNames(uniqueNames);
    } catch (err) {
      console.error('Error fetching planned exercises', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedWorkouts();
  }, [authState.token, logout, navigate]);

  if (loading) return <LoadingScreen />;

  const filteredWorkouts = selectedWorkout
    ? plannedWorkouts.filter(
        (workout) => workout.workoutName === selectedWorkout
      )
    : plannedWorkouts;

  return (
    <PageLayout
      header={
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Planned Workouts
          </Typography>
          <Autocomplete
            options={workoutNames}
            value={selectedWorkout}
            getOptionLabel={(option) => (option ? option : '')}
            onChange={(event, newValue) => {
              setSelectedWorkout(newValue || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Workouts"
                variant="outlined"
              />
            )}
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddWorkout}
            fullWidth>
            Plan a New Workout
          </Button>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tap on a workout to start it.
          </Typography>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </>
      }>
      {plannedWorkouts.length === 0 ? (
        <Typography variant="body1">No planned workouts found</Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {filteredWorkouts.map((workout) => (
            <React.Fragment key={workout.id}>
              <ListItem
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
                <ListItemButton onClick={() => handleStartWorkout(workout.id)}>
                  <ListItemText
                    primary={workout.workoutName}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        pr: 5,
                      },
                    }}
                    secondary={workout.plannedDate}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </PageLayout>
  );
}
export default Workouts;
