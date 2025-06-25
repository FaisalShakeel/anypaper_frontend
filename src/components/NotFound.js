import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

// Container styles
const NotFoundContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  flexDirection: 'column',
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#006F74' : '#f2f2f2',
  color: theme.palette.mode === 'dark' ? '#fff' : '#333',
  padding: theme.spacing(4),
}));

// Heading styles
const NotFoundHeading = styled(Typography)(({ theme }) => ({
  fontSize: '5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#fff' : '#006F74',
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

// Subheading styles
const NotFoundSubheading = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(3),
  color: theme.palette.mode === 'dark' ? '#fff' : '#006F74',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

// Button styles
const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#FFA500' : '#006F74',
  color: '#fff',
  padding: theme.spacing(1, 4),
  borderRadius: '30px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#FF8C00' : '#004d42',
  },
}));

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundHeading variant="h1">404</NotFoundHeading>
      <NotFoundSubheading variant="h6">
        Oops! The page you are looking for doesn’t exist.
      </NotFoundSubheading>
      <Link to="/">
        <BackButton>Go to Home</BackButton>
      </Link>
    </NotFoundContainer>
  );
};

export default NotFound;
