import React, { useContext, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useOrderContext } from '../contexts/OrderContext';

const CustomStepper = ({ steps, activeStep }) => {
  const { user } = useContext(AuthContext);
  const {
    typeOfPaper,
    fieldOfStudy,
    academicLevel,
    quantity,
    deadline,
    specificRequirements,
    referenceStyle,
    noOfSources,
    hasPaidForOrder
  } = useOrderContext();

  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const areOrderFieldsFilled = () => {
    return (
      typeOfPaper &&
      fieldOfStudy &&
      academicLevel &&
      quantity >= 1 &&
      deadline &&
      specificRequirements &&
      specificRequirements.trim().split(/\s+/).length >= 3 &&
      noOfSources >= 1 &&
      referenceStyle
    );
  };

  const handleStepClick = (index) => {
    if (index === 0) {
      navigate('/student/placeorder/step/1');
    } else if (index === 1) {
      if (areOrderFieldsFilled()) {
        navigate('/student/placeorder/step/2');
      } else {
        setSnackbar({
          open: true,
          message: 'Oops! Please fill all required fields to proceed to the Sign Up or Login page.',
          severity: 'error'
        });
      }
    } else if (index === 2) {
      const errors = [];
      if (!areOrderFieldsFilled()) {
        errors.push('fill all required fields');
      }
      if (!user) {
        errors.push('sign in');
      }
      if (errors.length > 0) {
        setSnackbar({
          open: true,
          message: `Oops! Please ${errors.join(' and ')} to proceed to the Payment page.`,
          severity: 'error'
        });
      } else {
        navigate('/student/placeorder/step/3');
      }
    } else if (index === 3) {
      const errors = [];
      if (!areOrderFieldsFilled()) {
        errors.push('fill all required fields');
      }
      if (!user) {
        errors.push('sign in');
      }
      if (!hasPaidForOrder) {
        errors.push('complete your payment');
      }
      if (errors.length > 0) {
        setSnackbar({
          open: true,
          message: `Oops! Please ${errors.join(', ')} to view your order progress.`,
          severity: 'error'
        });
      } else {
        navigate('/student/placeorder/step/4');
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mt: -5,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          px: { xs: 0.5, sm: 2 },
          position: 'relative',
          gap: { xs: 0.5, sm: 0 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '30%', sm: '32%' },
            left: { xs: '14%', sm: '12%' },
            right: { xs: '14%', sm: '12%' },
            height: '1px',
            backgroundColor: 'lightgray',
            zIndex: 0,
            transform: 'translateY(-50%)',
          }}
        />

        {steps.map((label, index) => (
          <Box
            key={label}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              ml: index === 0 ? { xs: -1, sm: -2 } : 0,
              mr: index === steps.length - 1 ? { xs: -1, sm: -2 } : 0,
            }}
          >
            <Box
              onClick={() => handleStepClick(index)}
              sx={{
                width: { xs: 30, sm: 35, md: 45 },
                height: { xs: 30, sm: 35, md: 45 },
                borderRadius: '50%',
                backgroundColor: index + 1 === activeStep ? 'orange' : 'lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: index + 1 === activeStep ? 'white' : 'black',
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                }}
              >
                {`0${index + 1}`}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: index + 1 === activeStep ? 'orange' : 'gray',
                fontWeight: 400,
                fontSize: { xs: '0.43rem', sm: '0.75rem', md: '0.875rem' },
                textAlign: 'center',
                mt: 0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomStepper;