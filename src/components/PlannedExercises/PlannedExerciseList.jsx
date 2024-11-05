import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function PlannedExerciseList() {
  const [plannedExercises, setPlannedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddExercise = () => {
    navigate('/add-planned');
  };

  const handleDeleteExercise = async (id) => {
    try {
      await api.delete(`/planned/${id}`);
      fetchPlannedExercises();
      setError(null);
    } catch (err) {
      console.error('Error deleting planned exercise', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.entries(errorData).map(
          ([field, message]) => `${message}`
        );
        setError(errorMessages);
      }
    }
  };

  const fetchPlannedExercises = async () => {
    try {
      const response = await api.get('/planned');
      setPlannedExercises(response.data);
    } catch (err) {
      console.error('Error fetching planned exercises', err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to load planned exercises');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedExercises();
  }, [authState.token, logout, navigate]);

  if (loading)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingBottom: '64px',
      }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Planned Exercises
      </Typography>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddExercise}
        fullWidth>
        Add New Exercise
      </Button>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {plannedExercises.length === 0 ? (
        <Typography variant="body1">No planned exercises found</Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {plannedExercises.map((exercise) => (
            <React.Fragment key={exercise.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteExercise(exercise.id)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                <ListItemText
                  primary={exercise.exerciseName}
                  secondary={`Sets: ${exercise.plannedSets}, Reps: ${exercise.plannedReps}, Weight: ${exercise.plannedWeight}kg (${exercise.muscleGroup})`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
}

export default PlannedExerciseList;
