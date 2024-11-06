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
    workoutNotes: '',
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
            exerciseNotes: '',
          })),
          workoutNotes: '',
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const workoutLog = {
        workoutNotes: formData.workoutNotes,
        exercises: formData.exercises.map((exercise, exerciseIndex) => ({
          exerciseId: exercise.exerciseId,
          exerciseNotes: exercise.exerciseNotes,
          exerciseName: exercise.exerciseName,
          setLogDtoList: exercise.setLogDtoList.map((set, setIndex) => ({
            setNumber: set.setNumber,
            reps: exercise.currentReps[setIndex],
            weight: exercise.currentWeight[setIndex],
          })),
        })),
      };
      await api.post(`/workouts/complete/${id}`, workoutLog);
      navigate('/workouts');
    } catch (err) {
      console.error('Error completing workout', err);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: '64px',
        paddingTop: '20px',
      }}>
      <Box sx={{ flexShrink: 0 }}>
      <Typography variant="h5" noWrap gutterBottom sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line" }}>
        Start workout:{'\n'}
        {workoutName}{"\n"}
        - {plannedDate}{"\n"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1, mb: 1 }}>
      <form>
        {exercises.length === 0 ? (
          <Typography variant="body1">No exercises found</Typography>
        ) : (
          <List>
            {exercises.map((exercise, exerciseIndex) => (
              <React.Fragment key={exercise.exerciseId}>
                <Typography variant="h6" sx={{ mt: 2 }}>{exercise.exerciseName}</Typography>
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
                <TextField
                  label="Exercise Notes (optional)"
                  name="exerciseNotes"
                  value={exercise.exerciseNotes}
                  onChange={(e) => {
                    const updatedExercises = [...formData.exercises];
                    updatedExercises[exerciseIndex].exerciseNotes =
                      e.target.value;
                    setFormData({ ...formData, exercises: updatedExercises });
                  }}
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                />
              </React.Fragment>
            ))}
          </List>
        )}
        <TextField
          label="Workout Notes (optional)"
          name="workoutNotes"
          value={formData.workoutNotes}
          onChange={(e) => {
            setFormData({ ...formData, workoutNotes: e.target.value });
          }}
          multiline
          rows={2}
          fullWidth
          variant="outlined"
        />
      </form>
      </Box>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => onSubmit()} color="primary" variant="outlined" fullWidth>
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
    </Container>
  );
}

export default StartWorkout;
