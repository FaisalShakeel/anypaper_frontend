import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableHead, TableCell, TableContainer, TableRow,
  Paper, Box, Snackbar, Alert, Stack, CircularProgress
} from '@mui/material';
import {
  ArrowBack, Delete, Download, CloudUpload, InsertDriveFile, Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';
import CircularProgressLoading from '../CircularProgress';

// Styled components
const StyledCard = styled(Card)(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  height: '150px',
  transition: 'transform 0.2s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const CardContainer = styled(Box)(() => ({
  position: 'relative',
  marginTop: '24px',
}));

const CardTitle = styled(Typography)(() => ({
  position: 'absolute',
  top: '-24px',
  left: '0',
  fontWeight: 'normal',
  color: 'rgba(0, 0, 0, 0.7)',
  fontSize: '1rem',
}));

const UploadSection = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.warning.main}`,
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center',
  backgroundColor: '#FFF9EB',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '16px',
  },
}));

const FileCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  marginBottom: '8px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

const DeleteButton = styled(IconButton)(() => ({
  backgroundColor: '#FF8A80',
  color: '#D32F2F',
  borderRadius:'50%',
  width: '36px',
  height: '36px',
  marginRight: '8px',
  '&:hover': {
    backgroundColor: '#FF6B60',
  },
}));

const DownloadButton = styled(IconButton)(() => ({
  backgroundColor: '#FF9800',
  color: '#FFFFFF',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  '&:hover': {
    backgroundColor: '#F57C00',
  },
}));

const CloseButton = styled(IconButton)(() => ({
  color: '#D32F2F',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
}));

const MyFiles = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [files, setFiles] = useState({ myUploads: [], solutionFiles: [], draftFiles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingFiles, setDeletingFiles] = useState(new Set());
  const [uploadingFiles, setUploadingFiles] = useState(new Set());

  // Card data
  const cards = [
    { title: 'My Uploads', bgcolor: '#FFF9EB', fileType: 'MyUploads' },
    { title: 'Solutions', bgcolor: '#E6FFD3', fileType: 'SolutionFiles' },
    { title: 'Pending', bgcolor: '#CDF7FF', fileType: null },
    { title: 'Drafts', bgcolor: '#E1F4FF', fileType: 'DraftFiles' },
  ];

  // Fetch files
  const getMyFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/students/my-files`, {
        withCredentials: true
      });
      console.log(response.data.files)
      if (response.data.success) {
        setFiles(response.data.files);
      } else {
        setError(response.data.message || 'Failed to fetch files.');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error fetching files.');
    } finally {
      setLoading(false);
    }
  };

  // Handle card click
  const handleCardClick = (title) => {
    setSelectedSection(title);
  };

  // Handle back button
  const handleBack = () => {
    setSelectedSection(null);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      file,
    }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  // Handle file download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, { method: "GET" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "downloaded-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: `${fileName} downloaded successfully!`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error downloading file.', severity: 'error' });
    }
  };

  // Handle file upload
  const handleUpload = async (file) => {
    const card = cards.find((c) => c.title === selectedSection);
    if (!card?.fileType) {
      setSnackbar({ open: true, message: 'Uploads not supported for this section.', severity: 'error' });
      return;
    }

    setUploadingFiles((prev) => new Set([...prev, file.name]));

    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('fileType', card.fileType);

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/students/add-to-my-files`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success && response.data.file) {
        setSnackbar({ open: true, message: `${file.name} uploaded successfully!`, severity: 'success' });
        setSelectedFiles(selectedFiles.filter((f) => f.name !== file.name));

        setFiles((prevFiles) => {
          const newFiles = { ...prevFiles };
          if (card.fileType === 'MyUploads') {
            newFiles.myUploads = [...newFiles.myUploads, response.data.file];
          } else if (card.fileType === 'SolutionFiles') {
            newFiles.solutionFiles = [...newFiles.solutionFiles, response.data.file];
          } else if (card.fileType === 'DraftFiles') {
            newFiles.draftFiles = [...newFiles.draftFiles, response.data.file];
          }
          return newFiles;
        });
      } else {
        setSnackbar({ open: true, message: response.data.message || 'Upload failed.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error uploading file.', severity: 'error' });
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
    }
  };

  // Handle file delete
  const handleDelete = async (fileId, fileName) => {
    const card = cards.find((c) => c.title === selectedSection);
    if (!card?.fileType) {
      setSnackbar({ open: true, message: 'Deletion not supported for this section.', severity: 'error' });
      return;
    }

    setDeletingFiles((prev) => new Set([...prev, fileId]));

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/students/delete-file/${fileId}/${card.fileType}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setSnackbar({ open: true, message: `${fileName} deleted successfully!`, severity: 'success' });
        
        setFiles((prevFiles) => {
          const newFiles = { ...prevFiles };
          if (card.fileType === 'MyUploads') {
            newFiles.myUploads = newFiles.myUploads.filter(file => file.id !== fileId);
          } else if (card.fileType === 'SolutionFiles') {
            newFiles.solutionFiles = newFiles.solutionFiles.filter(file => file.id !== fileId);
          } else if (card.fileType === 'DraftFiles') {
            newFiles.draftFiles = newFiles.draftFiles.filter(file => file.id !== fileId);
          }
          return newFiles;
        });
      } else {
        setSnackbar({ open: true, message: response.data.message || 'Deletion failed.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error deleting file.', severity: 'error' });
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  // Handle remove selected file
  const handleRemoveFile = (fileName) => {
    setSelectedFiles(selectedFiles.filter((f) => f.name !== fileName));
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    getMyFiles();
  }, []);

  // Get files for the selected section
  const getSectionFiles = () => {
    switch (selectedSection) {
      case 'My Uploads':
        return files.myUploads;
      case 'Solutions':
        return files.solutionFiles;
      case 'Drafts':
        return files.draftFiles;
      case 'Pending':
        return files.draftFiles;
      default:
        return [];
    }
  };

  // Render cards view
  const renderCards = () => (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} md={6} key={card.title}>
          <CardContainer>
            <CardTitle variant="h6" sx={{fontWeight:500}}>{card.title}</CardTitle>
            <StyledCard bgcolor={card.bgcolor} onClick={() => handleCardClick(card.title)}>
              <CardContent>
                <img
                  src={require(`../landingpage/${card.title === 'My Uploads' ? 'MyUploads' : card.title === 'Solutions' ? 'Solutions' : 'BlueFile'}.png`)}
                  alt={`${card.title} icon`}
                  style={{ width: '64px', height: '64px' }}
                />
              </CardContent>
            </StyledCard>
          </CardContainer>
        </Grid>
      ))}
    </Grid>
  );

  // Render section page
  const renderSectionPage = () => (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {selectedSection}
        </Typography>
      </Box>

      {/* Loading or Error */}
      {loading && (
       <CircularProgressLoading/>
      )}
      {error && (
        <ErrorMessage message={error} onTryAgain={getMyFiles}/>
      )}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Added</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>File Size</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSectionFiles().map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{new Date(file.addedON).toLocaleDateString()}</TableCell>
                  <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <DeleteButton onClick={() => handleDelete(file.id, file.name)}>
                      {deletingFiles.has(file.id) ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <Delete />
                      )}
                    </DeleteButton>
                    <DownloadButton onClick={() => handleDownload(file.path, file.name)}>
                      <Download />
                    </DownloadButton>
                  </TableCell>
                </TableRow>
              ))}
              {getSectionFiles().length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No files found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Upload and Preview Sections */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {/* Upload Section */}
          <Grid item xs={12} md={6}>
            <UploadSection>
              <CloudUpload sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: '#FF9800',
                  color: 'white',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#F57C00',
                  },
                }}
              >
                Browse Files
                <input type="file" hidden multiple onChange={handleFileSelect} />
              </Button>
            </UploadSection>
          </Grid>

          {/* File Preview Section */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              {selectedFiles.map((file) => (
                <FileCard key={file.name}>
                  <InsertDriveFile sx={{ mr: 2, color: 'grey.600' }} />
                  <Box flexGrow={1}>
                    <Typography variant="body1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.size}
                    </Typography>
                  </Box>
                  <CloseButton onClick={() => handleRemoveFile(file.name)}>
                    <Close />
                  </CloseButton>
                  <Button
                    variant="contained"
                    disabled={uploadingFiles.has(file.name)}
                    sx={{
                      backgroundColor: '#FF9800',
                      color: 'white',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: '#F57C00',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#FF9800',
                        color: 'white',
                        opacity: 0.6,
                      },
                    }}
                    onClick={() => handleUpload(file)}
                    startIcon={
                      uploadingFiles.has(file.name) ? (
                        <CircularProgress size= {20} sx={{ color: 'white' }} />
                      ) : null
                    }
                  >
                    {uploadingFiles.has(file.name) ? 'Uploading' : 'Upload'}
                  </Button>
                </FileCard>
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {selectedSection ? renderSectionPage() : renderCards()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyFiles;