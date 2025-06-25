import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Chip,
  useMediaQuery,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const commonStyles = {
  height: '40px',
  bgcolor: '#ffffff',
  borderRadius: '50px',
  width: '100%',
  boxShadow: 'none',
  '.MuiOutlinedInput-notchedOutline': { 
    border: 0,
    borderColor: '#ffffff !important'
  },
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '50px',
    backgroundColor: '#ffffff',
    border: 'none',
    '&:hover, &.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ffffff !important',
        border: 'none !important'
      }
    }
  }
};

const selectStyles = {
  ...commonStyles,
  '& .MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  }
};

const Students = () => {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filter1, setFilter1] = useState('All except cancelled');
  const [filter2, setFilter2] = useState('All');
  const [filter3, setFilter3] = useState('None');
  const [orderHistory, setOrderHistory] = useState([]);

  const isMobile = useMediaQuery("(max-width:600px)");

  // Filter the students
  const filteredStudents = students.filter((item) => {
    if (!item.student) return false;
    if (searchQuery && !item.student.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter3 !== "None") {
      console.log("Selected Date", selectedDate);
      const studentCreationDate = item.student.createdAt?.split("T")[0];
      if (studentCreationDate !== selectedDate) {
        return false;
      }
    }
    return true;
  });

  const handleOpen = (item) => {
    setSelectedStudentName(item.student?.fullName || '');
    setOrderHistory(item.orders || []);
    setOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const getStudentsWithOrderHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_STUDENTS_WITH_ORDER_HISTORY}`,
        { withCredentials: true }
      );
      console.log("Students With Order History", response.data);
      if (response.data.success) {
        setStudents(response.data.students);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch students');
        toast.error(response.data.message, { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch students';
      setError(errorMessage);
      toast.error(errorMessage, { style: { fontWeight: "bold" } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentsWithOrderHistory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, bgcolor: '#f9f9f9', height: '100%' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, bgcolor: '#f9f9f9', height: '100%' }}>
        <ErrorMessage message={error} onTryAgain={getStudentsWithOrderHistory} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, bgcolor: "#f9f9f9", height: "100%" }}>
      <ToastContainer />
      {/* Heading */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: 2 }}
      >
        Students
      </Typography>
      
      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
          gap: 2,
          alignItems: "center",
          marginBottom: 3,
          paddingX: 2,
          width: "100%",
        }}
      >
        <TextField
          placeholder="Search student by name"
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
            width: "100%",
            bgcolor: "#ffffff",
            borderAnnex: "50px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "50px",
              backgroundColor: "#ffffff",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
              "&:hover": { bgcolor: "#ffffff" },
            },
          }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr", lg: "1fr" },
            gap: 2,
            width: "100%",
          }}
        >
          <Select
            value={filter3}
            onChange={(e) => setFilter3(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "100%", md: "100%", lg: "500px" },
              bgcolor: "#ffffff",
              borderRadius: "50px",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                height: "40px",
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
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
      {/* Student Cards */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {filteredStudents.map((item) => (
          <Box
            key={item.id}
            sx={{
              width: "100%",
              maxWidth: "250px",
              bgcolor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
              padding: 2,
              marginBottom: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: 1,
              }}
            >
              {item.student?.fullName || 'Unknown'}
            </Typography>
            <Typography
              sx={{ color: "gray", marginBottom: 1, fontSize: "14px" }}
            >
              {item.student?.gender || 'N/A'}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: 1,
              }}
            >
              Total Orders
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: 2,
              }}
            >
              {item.orders?.length || 0}
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FFB74D",
                color: "white",
                textTransform: "none",
                fontSize: "12px",
                "&:hover": {
                  bgcolor: "#FFA726",
                },
              }}
              onClick={() => handleOpen(item)}
            >
              Order History
            </Button>
          </Box>
        ))}
      </Box>

      {/* Order History Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            width: isMobile ? "90%" : "500px",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            >
              Student Order History
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FFB74D",
                color: "white",
                textTransform: "none",
                fontSize: "12px",
                "&:hover": {
                  bgcolor: "#FFA726",
                },
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>

          {/* Student Info */}
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: 1,
            }}
          >
            Name: {selectedStudentName}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              marginBottom: 2,
            }}
          >
            Total Orders: {orderHistory.length}
          </Typography>

          {/* Scrollable Order History Table */}
          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "10px",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#a8a8a8",
              },
            }}
          >
            {/* Table Headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                marginBottom: 2,
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              <Typography>ID</Typography>
              <Typography>Topic & Subject</Typography>
              <Typography>Deadline</Typography>
              <Typography>Status</Typography>
            </Box>

            {/* Order History Rows */}
            {orderHistory.map((order) => (
              <Box
                key={order._id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                  padding: 1,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  marginBottom: 2,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "12px" }}>
                  {order._id?.slice(0, 5).toUpperCase() || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {`${order.typeOfPaper || 'Unknown'} (${order.fieldOfStudy || 'Unknown'})`}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {order.deadline ? formatDate(order.deadline) : 'N/A'}
                </Typography>
                <Chip
                  label={order.status || 'Unknown'}
                  sx={{
                    bgcolor:
                      order.status === "pending"
                        ? "rgba(255, 193, 7, 0.2)"
                        : "rgba(76, 175, 80, 0.2)",
                    color:
                      order.status === "pending"
                        ? "#FFC107"
                        : "#4CAF50",
                    fontWeight: "bold",
                    height: "20px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
      {/* Date Modal */}
      <Modal open={dateModelOpen} onClose={() => setDateModelOpen(false)}>
        <Box 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
 magister: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "40%" }, 
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            textAlign: "center"
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: "orange", 
              marginBottom: 2, 
              fontWeight: "bold" 
            }}
          >
            Pick a Date
          </Typography>
          <Grid container justifyContent="center">
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value).toISOString().split("T")[0]);
                setDateModelOpen(false);
              }}
              fullWidth
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& input": {
                  padding: "12px",
                  fontSize: "16px",
                  color: "#333",
                  borderRadius: "8px"
                },
                "& fieldset": { borderColor: "#FF6F00" },
                "&:hover fieldset": { borderColor: "#FF9800" },
                "&.Mui-focused fieldset": { borderColor: "#FF6F00" },
                marginBottom: 3
              }}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Students;