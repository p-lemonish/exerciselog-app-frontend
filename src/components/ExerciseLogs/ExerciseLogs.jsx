import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ExerciseLogRow from './ExerciseLogRow';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

function ExerciseLogs() {
  const { logout } = useContext(AuthContext);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [exerciseNames, setExerciseNames] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openLogIds, setOpenLogIds] = useState({});

  useEffect(() => {
    setOpenLogIds({});
  }, [selectedExercise]);

  useEffect(() => {
    fetchExerciseLogs();
  }, []);

  const fetchExerciseLogs = async () => {
    try {
      const response = await api.get('/logs');
      setExerciseLogs(response.data);
      const uniqueNames = [
        ...new Set(
          response.data
            .map((log) => log.exerciseName)
            .filter((name) => name != null)
        ),
      ];
      setExerciseNames(uniqueNames);
      setError('');
    } catch (err) {
      console.error('Error fetching exercise logs', err);
      if (err.response && err.response.status === 401) {
        logout();
      } else {
        setError('Failed to load exercise logs');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = selectedExercise
    ? exerciseLogs.filter((log) => log.exerciseName === selectedExercise)
    : exerciseLogs;

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
        <Typography variant="h4" gutterBottom>
          Exercise Logs
        </Typography>
        <Autocomplete
          options={exerciseNames}
          value={selectedExercise}
          getOptionLabel={(option) => (option ? option : '')}
          onChange={(event, newValue) => {
            setSelectedExercise(newValue || '');
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Exercises" variant="outlined" />
          )}
          sx={{ mb: 1 }}
        />
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Box>
      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell padding='none'>Date</TableCell>
              <TableCell padding='normal'>Name</TableCell>
              <TableCell padding='none'>Reps</TableCell>
              <TableCell padding='none'>Weight</TableCell>
            </TableRow>
          </TableHead>
          {exerciseLogs.length === 0 ? (
            <TableBody>
              <TableRow key={'No exercise found'}>
                <TableCell colSpan={5} align="center">
                  No exercise logs found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredLogs.map((log) => (
                <ExerciseLogRow
                  log={log}
                  key={log.id}
                  open={!!openLogIds[log.id]}
                  onToggle={() => {
                    setOpenLogIds((prev) => ({
                      ...prev,
                      [log.id]: !prev[log.id],
                    }));
                  }}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </Paper>
    </Container>
  );
}
export default ExerciseLogs;
