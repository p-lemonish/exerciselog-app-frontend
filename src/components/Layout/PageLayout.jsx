import React from 'react';
import { Container, Box } from '@mui/material';

// eslint-disable-next-line react/prop-types
function PageLayout({ header, children }) {
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
      <Box sx={{ flexShrink: 0 }}>{header}</Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1, mb: 1 }}>
        {children}
      </Box>
    </Container>
  );
}

export default PageLayout;
