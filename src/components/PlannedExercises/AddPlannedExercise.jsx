import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingScreen from '../LoadingScreen';
import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import NumberInput from '../NumberInput';
import { handleApiError } from '../ErrorHandler'

function AddPlannedExercise() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    exerciseName: '',
    muscleGroup: '',
    plannedReps: '',
    plannedSets: '',
    plannedWeight: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { authState, logout } = useContext(AuthContext);

  const {
    exerciseName,
    muscleGroup,
    plannedReps,
    plannedSets,
    plannedWeight,
    notes,
  } = formData;

  useEffect(() => {
    if (id) {
      setLoading(true);
      handleCopy();
    }
  }, [id, logout, navigate]);

  const handleCopy = async () => {
    try {
      const response = await api.get(`/planned/${id}`);
      setFormData({
        exerciseName: response.data.exerciseName,
        muscleGroup: response.data.muscleGroup,
        plannedReps: response.data.plannedReps,
        plannedSets: response.data.plannedSets,
        plannedWeight: response.data.plannedWeight,
        notes: response.data.notes,
      });
    } catch (err) {
      console.error('Error fetching exercise', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSetChange = (field, value) => {
    const updatedExercise = { ...formData };
    if (field === 'Reps') {
      updatedExercise.plannedReps = value;
    } else if (field === 'Weight') {
      updatedExercise.plannedWeight = value;
    } else if (field === 'Sets') {
      updatedExercise.plannedSets = value;
    }
    setFormData(updatedExercise);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/planned', {
        exerciseName,
        muscleGroup,
        plannedReps,
        plannedSets,
        plannedWeight,
        notes,
      });
      navigate('/planned-exercises');
    } catch (err) {
      console.log('Error while adding a planned exercise:', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Plan a new exercise
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Exercise Name"
          name="exerciseName"
          value={exerciseName}
          onChange={onChange}
          type="exerciseName"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Muscle Group (optional if adding existing exercise name)"
          name="muscleGroup"
          value={muscleGroup}
          onChange={onChange}
          type="muscleGroup"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          sx={{ mb: 2 }}
        />
        <List sx={{ marginRight: '-15px', marginLeft: '-15px', mb: 2 }}>
          <Box>
            <ListItem>
              <ListItemText variant="body1">Planned Sets:</ListItemText>
              <NumberInput
                value={Number(plannedSets)}
                onChange={(event, newValue) => {
                  handleSetChange('Sets', newValue);
                }}
                aria-label="Sets"
                min={0}
                max={999}
                step={1}
                endAdornment={
                  <InputAdornment position="end">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </InputAdornment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText variant="body1">Planned Reps:</ListItemText>
              <NumberInput
                value={Number(plannedReps)}
                onChange={(event, newValue) => {
                  handleSetChange('Reps', newValue);
                }}
                aria-label="Reps"
                min={0}
                max={999}
                step={1}
                endAdornment={
                  <InputAdornment position="end">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </InputAdornment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText variant="body1">Planned Weight:</ListItemText>
              <NumberInput
                value={Number(plannedWeight)}
                onChange={(event, newValue) => {
                  handleSetChange('Weight', newValue);
                }}
                aria-label="Weight"
                min={0}
                max={999}
                step={0.5}
                endAdornment={
                  <InputAdornment position="end">kg</InputAdornment>
                }
              />
            </ListItem>
          </Box>
        </List>
        <TextField
          label="Notes (optional)"
          name="notes"
          value={notes}
          onChange={onChange}
          type="notes"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" color="primary" variant="outlined" fullWidth>
          Save
        </Button>
      </form>
      <Button
        type="cancel"
        color="primary"
        variant="outlined"
        onClick={handleCancel}
        fullWidth>
        Cancel
      </Button>
    </Container>
  );
}

export default AddPlannedExercise;
