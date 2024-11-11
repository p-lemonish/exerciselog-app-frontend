import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingScreen from '../LoadingScreen';
import {
  Box,
  List,
  Alert,
  Button,
  TextField,
  Typography,
  ListItem,
  Checkbox,
  ListItemText,
  Divider,
  Autocomplete,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import PageLayout from '../Layout/PageLayout';

function AddWorkout() {
  const params = useParams();
  const idFromParams = params.id ? Number(params.id) : null;
  const isEditMode = Boolean(idFromParams);
  const [formData, setFormData] = useState({
    id: 0,
    workoutName: '',
    selectedExerciseIds: [],
    plannedDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [plannedExercises, setPlannedExercises] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id, workoutName, selectedExerciseIds, plannedDate } = formData;

  const handleCancel = () => {
    navigate(-1);
  };
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isEditMode) {
        await api.post('/workouts', {
          id,
          workoutName,
          selectedExerciseIds,
          plannedDate,
        });

        setSuccessMessage('Added workout successfully');
        setFormData({
          id: 0,
          workoutName: '',
          selectedExerciseIds: [],
          plannedDate: '',
        });
        setError('');
        window.scrollTo(0, 0);
      } else {
        await api.put(`/workouts/${idFromParams}`, {
          id,
          workoutName,
          selectedExerciseIds,
          plannedDate,
        });
        navigate('/workouts');
      }
    } catch (err) {
      console.log('Error while adding a new workout:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.entries(errorData).map(
          ([field, message]) => `${message}`
        );
        setSuccessMessage('');
        setError(errorMessages);
      } else {
        setError('An error occurred while adding a new workout');
      }
    }
  };

  useEffect(() => {
    const fetchPlannedExercises = async () => {
      try {
        const response = await api.get('/planned');
        setPlannedExercises(response.data);

        if (isEditMode) {
          const workoutResponse = await api.get(`/workouts/${idFromParams}`);
          const workoutData = workoutResponse.data;

          setFormData({
            id: workoutData.id,
            workoutName: workoutData.workoutName,
            selectedExerciseIds: workoutData.selectedExerciseIds,
            plannedDate: workoutData.plannedDate,
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response) {
          if (err.response.status === 401) {
            logout();
            navigate('/login');
          } else if (err.response.status === 404) {
            setError('Workout not found');
          } else {
            setError('Failed to load data');
          }
        } else {
          setError('An error occurred while fetching data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlannedExercises();
  }, [authState.token, logout, navigate]);

  const handleExerciseToggle = (exerciseId) => () => {
    const currentIndex = selectedExerciseIds.indexOf(exerciseId);
    const newSelectedExercises = [...selectedExerciseIds];

    if (currentIndex === -1) {
      newSelectedExercises.push(exerciseId);
    } else {
      newSelectedExercises.splice(currentIndex, 1);
    }
    setFormData({ ...formData, selectedExerciseIds: newSelectedExercises });
  };

  if (loading) return <LoadingScreen />;

  return (
    <PageLayout
      header={
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Plan your workout
          </Typography>
          <TextField
            label="Workout Name"
            name="workoutName"
            value={workoutName}
            onChange={onChange}
            type="workoutName"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
            sx={{ mb: 1 }}
            required
          />
          <TextField
            label="Planned Date"
            name="plannedDate"
            value={plannedDate}
            onChange={onChange}
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
            sx={{ mb: 1 }}
            required
          />
          <Autocomplete
            options={plannedExercises.filter(
              (exercise) => !selectedExerciseIds.includes(exercise.id)
            )}
            getOptionLabel={(option) =>
              `${option.exerciseName}: ${option.plannedSets}x${option.plannedReps}@${option.plannedWeight}kg`
            }
            inputValue={inputValue}
            value={autocompleteValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                if (!selectedExerciseIds.includes(newValue.id)) {
                  setFormData({
                    ...formData,
                    selectedExerciseIds: [...selectedExerciseIds, newValue.id],
                  });
                }
                setAutocompleteValue(null);
              }
              setInputValue('');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Exercises"
                variant="outlined"
              />
            )}
            renderTags={() => null}
            sx={{ mb: 1 }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </>
      }>
      {
        <>
          <form style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {plannedExercises.length === 0 ? (
              <Typography variant="body1">
                No planned exercises found
              </Typography>
            ) : (
              <List>
                {plannedExercises.map((exercise) => {
                  const labelId = `checkbox-list-label-${exercise.id}`;

                  return (
                    <React.Fragment key={exercise.id}>
                      <ListItem
                        dense
                        onClick={handleExerciseToggle(exercise.id)}>
                        <Checkbox
                          edge="start"
                          checked={selectedExerciseIds.includes(exercise.id)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              noWrap
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                              {exercise.exerciseName}
                            </Typography>
                          }
                          secondary={`${exercise.plannedSets}x${exercise.plannedReps}@${exercise.plannedWeight}kg`}
                          secondaryTypographyProps={{
                            noWrap: true,
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            },
                          }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </form>
          <Box sx={{ mt: 1 }}>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="outlined"
              fullWidth>
              Save
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
        </>
      }
    </PageLayout>
  );
}

export default AddWorkout;
