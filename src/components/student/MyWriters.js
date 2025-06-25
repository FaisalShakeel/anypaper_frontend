import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Avatar,
  Rating,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Modal } from '@mui/material';
import { Favorite, Close } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import CircularProgressLoading from '../CircularProgress';
import ErrorMessage from '../ErrorMessage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500',
    },
    background: {
      default: '#FFFFFF',
    },
  },
});

const MyWriters = () => {
  const [allWriters, setAllWriters] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRatingModelOpen, setIsRatingModelOpen] = useState(false);
  const [selectedWriter, setSelectedWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRatingWriter, setIsRatingWriter] = useState(false);
  const [error, setError] = useState("");
  const [visibleMyWriters, setVisibleMyWriters] = useState(4);
  const [visibleTopWriters, setVisibleTopWriters] = useState(4);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleOpenRatingModal = (writer) => {
    setSelectedWriter(writer);
    setRating(0);
    setSubmitted(false);
    setIsRatingModelOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModelOpen(false);
    setSelectedWriter(null);
    setRating(0);
    setSubmitted(false);
  };

  const updateWriters = (updatedWriter) => {
    setAllWriters((prevWriters) =>
      prevWriters.map((item) =>
        item.writer._id === updatedWriter._id 
          ? { ...item, writer: updatedWriter }
          : item
      )
    );

    setTopWriters((prevWriters) =>
      prevWriters.map((item) =>
        item.writer._id === updatedWriter._id 
          ? { ...item, writer: updatedWriter }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setIsRatingWriter(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/students/rate-writer`,
        { writerId: selectedWriter._id, rating },
        { withCredentials:true }
      );
  
      if (response.data.success) {
        setSubmitted(true);
        updateWriters(response.data.updatedWriter);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
  
      setTimeout(() => {
        handleCloseRatingModal();
      }, 2000);
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsRatingWriter(false);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const getMyWriters = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/students/writers`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setAllWriters(response.data.allWriters);
        setTopWriters(response.data.topWriters);
      } else {
        setError(response.data.message);
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMoreMyWriters = () => {
    setVisibleMyWriters((prev) => prev + 4);
  };

  const handleSeeMoreTopWriters = () => {
    setVisibleTopWriters((prev) => prev + 4);
  };

  useEffect(() => {
    getMyWriters();
  }, []);

  const WriterCard = ({ item, index }) => (
    <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'white',
            p: 0,
          }}
        >
          <Favorite sx={{ color: 'red' }} />
        </IconButton>

        <Avatar
          sx={{
            width: 160,
            height: 160,
            marginRight: 2,
            borderRadius: 0,
          }}
          alt="Writer Image"
          src="/path-to-image.jpg"
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {item.writer._id.slice(0, 5).toUpperCase()}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={1}>
            {item.writer.writingExpertise[0]}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating
              name={`writer-rating-${item.writer._id}`}
              value={Number(item.writer.rating) || 0}
              readOnly
              size="large"
              sx={{ color: 'orange', marginRight: 1 }}
            />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="#073b4c" mb={2}>
            $0
          </Typography>
          <Button
            onClick={() => handleOpenRatingModal(item.writer)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              color: 'orange',
              borderColor: 'orange',
              borderRadius: '20px',
              padding: '8px 16px',
              marginTop: 'auto',
            }}
          >
            Rate Writer
          </Button>
        </Box>
      </Box>
    </Grid>
  );

  if (error) {
    return <ErrorMessage message={error} onTryAgain={getMyWriters} />;
  }

  if (loading) {
    return <CircularProgressLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" fontWeight="bold" color="black" mb={2}>
          My Writers
        </Typography>

        {allWriters.length === 0 ? (
          <Typography variant="body1" textAlign="center" mb={3}>
            No Writers
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} mb={3} alignItems="flex-start">
              {allWriters.slice(0, visibleMyWriters).map((item, index) => (
                <WriterCard item={item} index={index} key={item.writer._id} />
              ))}
            </Grid>
            {allWriters.length > visibleMyWriters && (
              <Typography
                variant="body2"
                sx={{
                  color: 'orange',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  cursor: 'pointer',
                  mt: 3,
                }}
                onClick={handleSeeMoreMyWriters}
              >
                See More
              </Typography>
            )}
          </>
        )}

        <Typography variant="h6" fontWeight="bold" color="black" mb={2} mt={5}>
          Top Writers
        </Typography>

        {topWriters.length === 0 ? (
          <Typography variant="body1" textAlign="center" mb={3}>
            No Writers
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} mb={3} alignItems="flex-start">
              {topWriters.slice(0, visibleTopWriters).map((item, index) => (
                <WriterCard item={item} index={index} key={item.writer._id} />
              ))}
            </Grid>
            {topWriters.length > visibleTopWriters && (
              <Typography
                variant="body2"
                sx={{
                  color: 'orange',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  cursor: 'pointer',
                  mt: 3,
                }}
                onClick={handleSeeMoreTopWriters}
              >
                See More
              </Typography>
            )}
          </>
        )}

        <Modal open={isRatingModelOpen} onClose={handleCloseRatingModal}>
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleCloseRatingModal}>
                <Close />
              </IconButton>
            </Box>
            <Typography variant="h5" gutterBottom align="center">
              Rate Writer
            </Typography>
            {selectedWriter && (
              <Typography variant="body1" align="center" mb={2}>
                Rating for writer: {selectedWriter._id.slice(0, 5).toUpperCase()}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={handleRatingChange}
                size="large"
                sx={{ color: 'primary.main' }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={rating === 0 || isRatingWriter}
              >
                {isRatingWriter ? "Submitting" : "Submit Rating"}
              </Button>
            </Box>
            {submitted && (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Thank you for your rating of {rating} stars!
              </Typography>
            )}
          </Box>
        </Modal>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default MyWriters;