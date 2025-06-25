import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Grid, Rating, Select, MenuItem, TextField, InputAdornment, Avatar, Modal } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import CircularProgressLoading from '../CircularProgress';
import ErrorMessage from '../ErrorMessage';

// Card container styles with hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(3),
  transition: 'box-shadow 0.3s ease',
  maxWidth: '100%',
  margin: { xs: '10px auto', md: '10px 0' },
  boxSizing: 'border-box',
}));

// Image styles
function EditorImage(editor) {
  return editor.photoUrl ? (
    <img 
      src={editor.photoUrl} 
      alt={editor.fullName} 
      style={{
        width: { xs: '40px', sm: '48px' }, 
        height: { xs: '40px', sm: '48px' }, 
        borderRadius: '50%', 
        objectFit: 'cover',
      }} 
    />
  ) : (
    <Avatar sx={{ bgcolor: 'lightgray', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, mb: "auto", mt: "20px" }}>
      {editor.fullName[0].toUpperCase()}
    </Avatar>
  );
}

// View Details Button Styles
const ViewDetailsButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  border: '1px solid #FFA500',
  color: '#FFA500',
  padding: { xs: '6px 12px', sm: '6px 16px' },
  textTransform: 'none',
  fontSize: { xs: '0.8rem', sm: '0.9rem' },
  width: '100%',
  '&:hover': {
    backgroundColor: '#FFA500',
    color: 'white',
  },
}));

// Delete Button Styles
const DeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  border: '1px solid #FFA500',
  color: '#FFA500',
  padding: { xs: '6px 12px', sm: '6px 16px' },
  textTransform: 'none',
  fontSize: { xs: '0.8rem', sm: '0.9rem' },
  width: '100%',
  '&:hover': {
    backgroundColor: '#FFA500',
    color: 'white',
  },
}));

const Editors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter1, setFilter1] = useState('All except cancelled');
  const [filter2, setFilter2] = useState('All');
  const [filter3, setFilter3] = useState('None');
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [editorToDelete, setEditorToDelete] = useState(null);

  // Filter the editors
  const filteredEditors = editors.filter((editor) => {
    if (searchQuery && !editor.fullName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter3 !== 'None') {
      const editorCreationDate = editor.createdAt.split('T')[0];
      if (editorCreationDate !== selectedDate) {
        return false;
      }
    }
    return true;
  });

  const getEditors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_ALL_EDITORS}`, { withCredentials: true });
      if (response.data.success) {
        setEditors(response.data.editors);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch editors');
        toast.error(response.data.message, { style: { fontWeight: 'bold' } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch editors';
      setError(errorMessage);
      toast.error(errorMessage, { style: { fontWeight: 'bold' } });
    } finally {
      setLoading(false);
    }
  };

  const deleteEditor = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/editors/delete-editor/${editorToDelete}`, { withCredentials: true });
      if (response.data.success) {
        setEditors(editors.filter(editor => editor._id !== editorToDelete));
        toast.success('Editor deleted successfully', { style: { fontWeight: 'bold' } });
        setDeleteModelOpen(false);
      } else {
        toast.error(response.data.message, { style: { fontWeight: 'bold' } });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message, { style: { fontWeight: 'bold' } });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getEditors();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
        <ErrorMessage message={error} onTryAgain={getEditors} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3 },
        bgcolor: '#f9f9f9',
        mx: { xs: 2, sm: 3 },
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <ToastContainer />
      <Typography
        variant='h4'
        fontWeight='bold'
        sx={{ marginBottom: 3, fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Editors
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', lg: 'center' },
          marginBottom: 3,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <TextField
          placeholder='Search editor by name'
          variant='outlined'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
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
            maxWidth: '100%',
          }}
        />
        <Select
          value={filter3}
          onChange={(e) => setFilter3(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: { lg: '500px' },
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
          <MenuItem value='None' onClick={() => setDateModelOpen(false)}>
            None
          </MenuItem>
          <MenuItem onClick={() => setDateModelOpen(true)} value='Creation Date'>
            Creation Date
          </MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
        {filteredEditors.map((editor, index) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
            <StyledCard>
              {EditorImage(editor)}
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  {editor._id.slice(0, 5).toUpperCase()}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  {editor.fullName}
                </Typography>
                <Rating
                  name={`rating-${editor._id}`}
                  value={editor.rating}
                  readOnly
                  precision={0.1}
                  sx={{ marginY: 1 }}
                />
                <Typography
                  variant='h6'
                  sx={{ color: '#006F74', fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  {editor.price}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                  <ViewDetailsButton onClick={() => navigate(`/admin/editor-profile/${editor._id}`)}>
                    View Details
                  </ViewDetailsButton>
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditorToDelete(editor._id);
                      setDeleteModelOpen(true);
                    }}
                  >
                    Delete
                  </DeleteButton>
                </Box>
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
            variant='h6'
            sx={{
              color: 'orange',
              marginBottom: 2,
              fontWeight: 'bold',
            }}
          >
            Pick a Date
          </Typography>
          <Box>
            <TextField
              type='date'
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
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModelOpen} onClose={() => setDeleteModelOpen(false)}>
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
            variant='h6'
            sx={{
              color: 'orange',
              marginBottom: 2,
              fontWeight: 'bold',
            }}
          >
            Confirm Deletion
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 3 }}>
            Are you sure you want to delete this editor?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              onClick={() => setDeleteModelOpen(false)}
              sx={{
                borderRadius: '20px',
                border: '1px solid #FFA500',
                color: '#FFA500',
                padding: { xs: '6px 12px', sm: '6px 16px' },
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                '&:hover': {
                  backgroundColor: '#FFA500',
                  color: 'white',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteEditor}
              disabled={deleting}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#FFA500',
                color: 'white',
                padding: { xs: '6px 12px', sm: '6px 16px' },
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                '&:hover': {
                  backgroundColor: '#FF8C00',
                },
                '&:disabled': {
                  backgroundColor: '#FFB74D',
                },
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Editors;