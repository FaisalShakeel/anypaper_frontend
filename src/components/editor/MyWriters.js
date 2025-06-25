import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Card, Grid, Rating } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CircularProgressLoading from '../CircularProgress';
import ErrorMessage from '../ErrorMessage';

const MyWriters = () => {
  const [loading, setLoading] = useState(true);
  const [writers, setWriters] = useState([]);
  const [error, setError] = useState('');

  const getMyWriters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EDITOR_WRITERS}`, { withCredentials: true });
      console.log("All writers", response.data);
      if (response.data.success) {
        setWriters(response.data.writers || []);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch writers');
        toast.error(response.data.message || 'Failed to fetch writers');
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'Failed to fetch writers';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyWriters();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', minHeight: '100vh' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', minHeight: '100vh' }}>
        <ErrorMessage message={error} onTryAgain={getMyWriters} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, bgcolor: 'white', minHeight: '100vh' }}>
      <ToastContainer />
      <Typography variant="h4" align="start">
        Writers Directory
      </Typography>
      <Typography variant="body1" color="textSecondary" align="start" sx={{ marginBottom: 3 }}>
        View and manage all Writer's You have collaborated with.
      </Typography>
      {writers.length === 0 ? (
        <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center" }}>
          No Writers Found!
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {writers.map((writer, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  borderBottom: '1px solid lightgray',
                  borderRight: '1px solid lightgray',
                  display: "flex",
                  flexDirection: "column",
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                <Rating value={writer.rating || 0} size="large" sx={{ marginLeft: "auto" }} />

                <Avatar
                  src={writer.photoUrl || ''}
                  alt='W'
                  sx={{
                    width: 70,
                    height: 70,
                    marginTop: 1,
                    position: 'relative',
                  }}
                />

                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {writer._id?.slice(0, 5) || 'N/A'}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    {writer.writingExpertise?.[0] || 'Unknown'}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#5f9ea0', fontWeight: 'bold', marginTop: 2 }}>
                    $0
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'orange',
                    color: 'orange',
                    marginTop: 2,
                    borderRadius: '20px',
                    width: { xs: "100%", sm: "100%", md: "55%", lg: "50%" },
                    textAlign: 'left',
                  }}
                >
                  Rate Writer
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyWriters;