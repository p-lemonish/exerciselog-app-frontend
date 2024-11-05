/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse,
  TableRow,
  TableCell,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

function ExerciseLogRow({ log, open, onToggle }) {

  const averageWeight =
    log.setLogDtoList && log.setLogDtoList.length > 0
      ? (
          log.setLogDtoList.reduce((acc, set) => acc + set.weight, 0) /
          log.setLogDtoList.length
        ).toFixed(2)
      : '';

  return (
    <>
      <TableRow onClick={onToggle}>
        <TableCell sx={{
          width: 40,
          padding: "1px",
          textAlign: "left"
        }}>
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon fontSize='small' /> : <KeyboardArrowDownIcon fontSize='small' />}
          </IconButton>
        </TableCell>
        <TableCell padding='none' sx={{ minWidth: 100 }}>
          {new Date(log.date).toLocaleDateString()}
        </TableCell>
        <TableCell padding='none'
          sx={{
            maxWidth: 100,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={log.exerciseName}>
          {log.exerciseName}
        </TableCell>
        <TableCell padding='none' sx={{ minWidth: 120 }}>
          {log.setLogDtoList &&
            log.setLogDtoList.slice(0, 3).map((set, index) => (
              <span key={`${log.id}-${set.setNumber}`}>
                {set.reps}
                {index < log.setLogDtoList.slice(0, 3).length - 1 ? ', ' : ''}
              </span>
            ))}
          {log.setLogDtoList && log.setLogDtoList.length > 3 ? '...' : ''}
        </TableCell>
        <TableCell padding='none' sx={{ maxWidth: 100 }}>{averageWeight ? `${averageWeight} kg` : ''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography gutterBottom component="div">
                {log.exerciseName}
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell padding='none'>Set Number</TableCell>
                    <TableCell padding='none'>Reps</TableCell>
                    <TableCell padding='none'>Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {log.setLogDtoList &&
                    log.setLogDtoList.map((set) => (
                      <TableRow key={`Collapse-${log.id}-${set.setNumber}`}>
                        <TableCell padding='none' component="th" scope="row">
                          {set.setNumber}
                        </TableCell>
                        <TableCell padding='none'>{set.reps}</TableCell>
                        <TableCell padding='none'>{set.weight.toFixed(2)}kg</TableCell>
                      </TableRow>
                    ))}
                  {log.exerciseNotes && (
                    <TableRow key={`Note-${log.id}`}>
                      <TableCell colSpan={3}>
                        <Typography variant="body2">
                          <strong>Note:</strong>{log.exerciseNotes}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default ExerciseLogRow