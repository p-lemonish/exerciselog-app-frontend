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
        <TableCell
          padding="none"
          sx={{
            width: 40,
            textAlign: 'left',
          }}>
          <IconButton aria-label="expand row" size="small">
            {open ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        <TableCell padding="none" sx={{ maxWidth: 100 }}>
          {new Date(log.date).toLocaleDateString()}
        </TableCell>
        <TableCell
          padding="normal"
          sx={{
            maxWidth: 110,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={log.exerciseName}>
          {log.exerciseName}
        </TableCell>
        <TableCell
          padding="none"
          sx={{
            paddingRight: '10px',
            maxWidth: 80,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {log.setLogDtoList &&
            log.setLogDtoList.map((set, index) => (
              <span key={`${log.id}-${set.setNumber}`}>
                {set.reps}
                {index < log.setLogDtoList.length - 1 ? ', ' : ''}
              </span>
            ))}
        </TableCell>
        <TableCell padding="none" sx={{ maxWidth: 150 }}>
          {averageWeight ? `${averageWeight} kg` : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={5}
          sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography
                sx={{
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }}>
                {log.exerciseName}
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell padding="normal">Set Number</TableCell>
                    <TableCell padding="normal">Reps</TableCell>
                    <TableCell padding="normal">Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {log.setLogDtoList &&
                    log.setLogDtoList.map((set) => (
                      <TableRow key={`Collapse-${log.id}-${set.setNumber}`}>
                        <TableCell padding="normal" component="th" scope="row">
                          {set.setNumber}
                        </TableCell>
                        <TableCell padding="normal">{set.reps}</TableCell>
                        <TableCell padding="normal">
                          {set.weight.toFixed(2)}kg
                        </TableCell>
                      </TableRow>
                    ))}
                  {log.exerciseNotes && (
                    <TableRow key={`Note-${log.id}`}>
                      <TableCell colSpan={3}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                          }}>
                          <strong>Note: </strong>
                          {log.exerciseNotes}
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

export default ExerciseLogRow;
