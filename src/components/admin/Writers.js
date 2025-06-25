import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Grid, Rating, Select, MenuItem, TextField, InputAdornment, Avatar, Modal } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CircularProgressLoading from '../CircularProgress';
import ErrorMessage from '../ErrorMessage';

// Card container styles with hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '10px 0',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(2),
  transition: 'box-shadow 0.3s ease',
}));

function WriterImage(writer) {
  return writer.photoUrl ? (
    <img 
      src={writer.photoUrl} 
      alt="W" 
      style={{
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        objectFit: 'cover',
      }} 
    />
  ) : (
    <Avatar sx={{ bgcolor: 'lightgray', width: 60, height: 60, mb: "auto", mt: "20px" }}>
      W
    </Avatar>
  );
}

// View Details Button Styles
const ViewDetailsButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  border: '1px solid #FFA500',
  color: '#FFA500',
  padding: '6px 16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#FFA500',
    color: 'white',
  },
}));

const Writers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter1, setFilter1] = useState('All except cancelled');
  const [filter2, setFilter2] = useState('All');
  const [filter3, setFilter3] = useState('None');
  const navigate = useNavigate();
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter the writers
  const filteredWriters = writers.filter((writer) => {
    if (searchQuery && !writer.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter3 !== 'None') {
      console.log('Selected Date', selectedDate);
      const writerCreationDate = writer.createdAt.split('T')[0];
      console.log('Selected Date By Student', selectedDate);
      if (writerCreationDate !== selectedDate) {
        return false;
      }
    }
    return true;
  });

  const getWriters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_ALL_WRITERS}`, { withCredentials: true });
      console.log('Writers', response.data);
      if (response.data.success) {
        setWriters(response.data.writers);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch writers');
       
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch writers';
      setError(errorMessage);
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWriters();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, bgcolor: '#f9f9f9' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, bgcolor: '#f9f9f9' }}>
        <ErrorMessage message={error} onTryAgain={getWriters} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, bgcolor: '#f9f9f9' }}>
      <ToastContainer />
      <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 3 }}>
        Writers
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' },
          gap: 2,
          alignItems: 'center',
          marginBottom: 3,
          paddingX: 2,
          width: '100%',
        }}
      >
        <TextField
          placeholder="Search writer by name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
            bgcolor: '#ffffff',
            borderRadius: '50px',
            '& .MuiOutlinedInput-root': {
              height: '40px',
              borderRadius: '50px',
              backgroundColor: '#ffffff',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
              '&:hover': { bgcolor: '#ffffff' },
            },
          }}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '1fr' },
            gap: 2,
            width: '100%',
          }}
        >
          <Select
            value={filter3}
            onChange={(e) => setFilter3(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '100%', md: '100%', lg: '500px' },
              bgcolor: '#ffffff',
              borderRadius: '50px',
              height: '40px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                height: '40px',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
            }}
          >
            <MenuItem value="None" onClick={() => setDateModelOpen(false)}>
              None
            </MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Creation Date">
              Creation Date
            </MenuItem>
          </Select>
        </Box>
      </Box>
      <Grid container spacing={2} justifyContent="flex-start">
        {filteredWriters.map((writer, index) => (
          <Grid
            onClick={() => {
              navigate(`/admin/writer-profile/${writer._id}`);
            }}
            item
            xs={12}
            sm={12}
            md={6}
            lg={5}
            key={index}
          >
            <StyledCard>
              {WriterImage(writer)}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">
                  {writer.name ? writer.name : writer._id.slice(0, 5).toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {writer.writingExpertise[0]}
                </Typography>
                <Rating
                  name={`rating-${writer._id}`}
                  value={writer.rating}
                  readOnly
                  precision={0.1}
                  sx={{ marginY: 1 }}
                />
                <Typography variant="h6" sx={{ color: '#006F74' }}>
                  {writer.price}
                </Typography>
                <ViewDetailsButton>View Details</ViewDetailsButton>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {/* Date Modal */}
      <Modal open={dateModelOpen} onClose={() => setDateModelOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '70%', md: '40%' },
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'orange',
              marginBottom: 2,
              fontWeight: 'bold',
            }}
          >
            Pick a Date
          </Typography>
          <Grid container justifyContent="center">
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value).toISOString().split('T')[0]);
                setDateModelOpen(false);
              }}
              fullWidth
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '8px',
                '& input': {
                  padding: '12px',
                  fontSize: '16px',
                  color: '#333',
                  borderRadius: '8px',
                },
                '& fieldset': { borderColor: '#FF6F00' },
                '&:hover fieldset': { borderColor: '#FF9800' },
                '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
                marginBottom: 3,
              }}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Writers;