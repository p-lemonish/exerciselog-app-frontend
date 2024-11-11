import React from 'react';
import { Container, CircularProgress } from '@mui/material';

function LoadingScreen() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '64px',
        paddingTop: '20px',
      }}>
      <CircularProgress />
    </Container>
  );
}

export default LoadingScreen;
