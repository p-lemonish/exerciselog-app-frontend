import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { styled } from '@mui/system';
import api from '../../services/api';
import NumberInput from '../NumberInput';
import {
  Alert,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

function StartWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    workoutName: '',
    plannedDate: '',
    exercises: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { workoutName, plannedDate, exercises } = formData;

  // Used for NumberInput-component
  const InputAdornment = styled('div')(
    ({ theme }) => `
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;
            color: ${theme.palette.text.secondary};
        `
  );

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const workoutResponse = await api.get(`/workouts/start/${id}`);
        const workoutData = workoutResponse.data;

        setFormData({
          workoutName: workoutData.workoutName,
          plannedDate: workoutData.plannedDate,
          exercises: workoutData.exercises.map((exercise) => ({
            ...exercise,
            currentReps: exercise.setLogDtoList.map((set) => set.reps),
            currentWeight: exercise.setLogDtoList.map((set) => set.weight),
          })),
        });
      } catch (err) {
        console.error('Error fetching workout', err);
        if (err.response) {
          if (err.response.status === 401) {
            logout();
            navigate('/login');
          } else if (err.response.status === 404) {
            setError('Workout not found');
          } else {
            setError('Failed to load workout data');
          }
        } else {
          setError('Failed to load workout data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id, authState.token, logout, navigate]);

  const handleCancel = () => {
    navigate('/workouts');
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...formData.exercises];
    if (field === 'reps') {
      updatedExercises[exerciseIndex].currentReps[setIndex] = value;
    } else if (field === 'weight') {
      updatedExercises[exerciseIndex].currentWeight[setIndex] = value;
    }
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const onSubmit = () => {};

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingBottom: '64px',
      }}>
      <Typography variant="h4" gutterBottom>
        Start workout: {workoutName} - {plannedDate}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={onSubmit}>
        {exercises.length === 0 ? (
          <Typography variant="body1">No exercises found</Typography>
        ) : (
          <List>
            {exercises.map((exercise, exerciseIndex) => (
              <React.Fragment key={exerciseIndex}>
                <Typography variant="h6">{exercise.exerciseName}</Typography>
                <List>
                  {exercise.setLogDtoList.map((set, setIndex) => (
                    <ListItem key={set.setNumber}>
                      <ListItemText
                        primary={`Set ${set.setNumber}`}
                        secondary={`${set.reps} reps @ ${set.weight}kg`}
                      />
                      <Box>
                        <NumberInput
                          value={exercise.currentReps[setIndex]}
                          onChange={(event, newValue) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              'reps',
                              newValue
                            )
                          }
                          aria-label="Reps"
                          min={0}
                          step={1}
                          endAdornment={<InputAdornment></InputAdornment>}
                        />
                        <NumberInput
                          value={exercise.currentWeight[setIndex]}
                          onChange={(event, newValue) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              'weight',
                              newValue
                            )
                          }
                          aria-label="Weight"
                          min={0}
                          step={0.5}
                          endAdornment={<InputAdornment>kg</InputAdornment>}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            ))}
          </List>
        )}
        <Box sx={{ mt: 2 }}>
          <Button type="submit" color="primary" variant="outlined" fullWidth>
            Complete workout
          </Button>
          <Button
            type="cancel"
            color="primary"
            variant="outlined"
            onClick={handleCancel}
            fullWidth>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default StartWorkout;
