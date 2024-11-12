import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingScreen from '../LoadingScreen';
import PageLayout from '../Layout/PageLayout';
import { handleApiError } from '../ErrorHandler'
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ContentCopy } from '@mui/icons-material';

function PlannedExerciseList() {
  const [plannedExercises, setPlannedExercises] = useState([]);
  const [exerciseNames, setExerciseNames] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddExercise = () => {
    navigate('/add-planned');
  };

  const handleCopyExercise = (id) => {
    navigate(`/add-planned/${id}`);
  };

  const handleDeleteExercise = async (id) => {
    try {
      await api.delete(`/planned/${id}`);
      fetchPlannedExercises();
      setError(null);
    } catch (err) {
      console.error('Error deleting planned exercise', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    }
  };

  const fetchPlannedExercises = async () => {
    try {
      const response = await api.get('/planned');
      const uniqueNames = [
        ...new Set(
          response.data
            .map((exercise) => exercise.exerciseName)
            .filter((name) => name != null)
        ),
      ];
      setExerciseNames(uniqueNames);
      setPlannedExercises(response.data);
    } catch (err) {
      console.error('Error fetching planned exercises', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedExercises();
  }, [authState.token, logout, navigate]);

  if (loading) return <LoadingScreen />;

  const filteredExercises = selectedExercise
    ? plannedExercises.filter(
        (exercise) => exercise.exerciseName === selectedExercise
      )
    : plannedExercises;

  return (
    <PageLayout
      header={
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Planned Exercises
          </Typography>
          <Autocomplete
            options={exerciseNames}
            value={selectedExercise}
            getOptionLabel={(option) => (option ? option : '')}
            onChange={(event, newValue) => {
              setSelectedExercise(newValue || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Exercises"
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
            onClick={handleAddExercise}
            fullWidth>
            Add New Exercise
          </Button>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </>
      }>
      {plannedExercises.length === 0 ? (
        <Typography variant="body1">No planned exercises found</Typography>
      ) : (
        <List>
          {filteredExercises.map((exercise) => (
            <React.Fragment key={exercise.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="start"
                      onClick={() => handleCopyExercise(exercise.id)}>
                      <ContentCopy />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteExercise(exercise.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      noWrap
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        pr: 5,
                      }}>
                      {exercise.exerciseName}
                    </Typography>
                  }
                  secondary={`Sets: ${exercise.plannedSets}, Reps: ${exercise.plannedReps}, Weight: ${exercise.plannedWeight}kg (${exercise.muscleGroup})`}
                  secondaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      pr: 5,
                    },
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </PageLayout>
  );
}

export default PlannedExerciseList;
