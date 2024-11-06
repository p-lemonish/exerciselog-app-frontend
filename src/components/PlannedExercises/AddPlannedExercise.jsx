import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Alert, Button, Container, TextField, Typography } from '@mui/material';

{/* 
    TODO Show a list of exercise names/muscle groups and allow the user to "duplicate" a planned exercise.
    Perhaps it could work in a way where they could click a name, and it will pre-fill the form with latest
    Planned Exercise data? Or just implement a duplicate functionality to the list.
    => User can duplicate a planned exercise, which appears below the original. User goes to edit the
    duplicate and thus has saved time.
*/}
function AddPlannedExercise() {
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

  const {
    exerciseName,
    muscleGroup,
    plannedReps,
    plannedSets,
    plannedWeight,
    notes,
  } = formData;

  const handleCancel = () => {
    navigate(-1);
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
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.entries(errorData).map(
          ([field, message]) => `${message}`
        );
        setError(errorMessages);
      } else {
        setError('An error occurred while adding planned exercise');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "20px" }}>
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
        <TextField
          label="Planned Sets"
          name="plannedSets"
          value={plannedSets}
          onChange={onChange}
          type="number"
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
          label="Planned Reps"
          name="plannedReps"
          value={plannedReps}
          onChange={onChange}
          type="number"
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
          label="Planned Weight"
          name="plannedWeight"
          value={plannedWeight}
          onChange={onChange}
          type="number"
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
