import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  IconButton,
  Divider,
  Slider,
  Modal,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";
import { ArrowBack } from "@mui/icons-material";

const WriterProfile = () => {
  const { id } = useParams();
  const [openSlider, setOpenSlider] = useState(false);
  const [writer, setWriter] = useState({});
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate()

  const handleOpenSlider = () => setOpenSlider(true);
  const handleCloseSlider = () => setOpenSlider(false);


  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const gradeMarks = [
    { value: 0, label: "0" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  const getWriterProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_WRITER_PROFILE}/${id}`,
        { withCredentials: true }
      );
      console.log("Writer Profile", response.data);
      if (response.data.success) {
        setWriter(response.data.writer);
        setStatistics(response.data.statistics);
        setOrders(response.data.orders);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch writer profile');
        toast.error(response.data.message, { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch writer profile';
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWriterProfile();
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
        <ErrorMessage message={error} onTryAgain={getWriterProfile} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <ToastContainer />
      <Button startIcon={<ArrowBack/>} sx={{color:"orange"}} onClick={()=>{navigate(-1)}}>
        Back
      </Button>
      {/* Top White Card */}
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
          boxShadow: 3,
        }}
      >
        {/* Left Section */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{ width: 80, height: 80 }}
            src="/path-to-avatar.jpg"
            alt="W"
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {writer._id ? writer._id.slice(0, 5).toUpperCase() : ''}
            </Typography>
            <Typography sx={{ color: "#555" }}>
              {writer.name ? writer.name : "Writer"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 192, 203, 0.5)",
                  p: 1.5,
                  borderRadius: "50%",
                }}
              >
                <ChatIcon sx={{ color: "orange" }} />
              </IconButton>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "orange",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                onClick={handleOpenSlider}
              >
                Give Grade
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Gender:</Typography>
            <Typography sx={{ color: "#555" }}>{writer.gender || ''}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Email:</Typography>
            <Typography sx={{ color: "#555" }}>{writer.email || ''}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Phone Number:</Typography>
            <Typography sx={{ color: "#555" }}>{writer.phoneNumber || ''}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Joined Since:</Typography>
            <Typography sx={{ color: "#555" }}>
              {writer.createdAt ? formatDate(writer.createdAt) : ''}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Rating:</Typography>
            <Typography sx={{ color: "#555" }}>
              {writer.rating ? `${writer.rating}/5` : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: "rgba(144, 238, 144, 0.5)",
                  p: 1.5,
                  borderRadius: "50%",
                }}
              >
                <TrendingUpIcon />
              </Box>
              <Typography sx={{ fontWeight: "bold" }}>Total Orders</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {statistics.totalOrders || 0}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUpIcon sx={{ color: "green" }} />
              <Typography sx={{ ml: 1, color: "green" }}>
                {statistics.growthPercentage || '0%'}
              </Typography>
              <Typography sx={{ ml: 1, color: "#aaa" }}>Prev 28 Days</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: "rgba(144, 238, 144, 0.5)",
                  p: 1.5,
                  borderRadius: "50%",
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Typography sx={{ fontWeight: "bold" }}>Completed Orders</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {statistics.completedOrders || 0}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUpIcon sx={{ color: "green" }} />
              <Typography sx={{ ml: 1, color: "green" }}>0%</Typography>
              <Typography sx={{ ml: 1, color: "#aaa" }}>Prev 28 Days</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255, 165, 0, 0.3)",
                  p: 1.5,
                  borderRadius: "50%",
                }}
              >
                <PendingIcon />
              </Box>
              <Typography sx={{ fontWeight: "bold" }}>Pending Orders</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {statistics.pendingOrders || 0}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUpIcon sx={{ color: "green" }} />
              <Typography sx={{ ml: 1, color: "green" }}>0%</Typography>
              <Typography sx={{ ml: 1, color: "#aaa" }}>Prev 28 Days</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: "rgba(173, 216, 230, 0.5)",
                  p: 1.5,
                  borderRadius: "50%",
                }}
              >
                <AssignmentTurnedInIcon />
              </Box>
              <Typography sx={{ fontWeight: "bold" }}>Without Revisions</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {statistics.withoutRevisionsOrders || 0}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUpIcon sx={{ color: "green" }} />
              <Typography sx={{ ml: 1, color: "green" }}>0%</Typography>
              <Typography sx={{ ml: 1, color: "#aaa" }}>Prev 28 Days</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Latest Orders Section */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Latest Orders
      </Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ color: "#555" }}>
                  {order._id.slice(0, 5).toUpperCase()}
                </Typography>
                <Typography>Physics Assignment</Typography>
                <Typography sx={{ color: "#555" }}>
                  {formatDate(order.deadline)}
                </Typography>
                <Typography sx={{ color: "#555" }}>PayPal</Typography>
                <Typography sx={{ color: "green" }}>{order.status}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grade Modal */}
      <Modal open={openSlider} onClose={handleCloseSlider}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "orange",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Assign Grade
          </Typography>
          <Slider
            defaultValue={50}
            step={1}
            marks={gradeMarks}
            min={0}
            max={100}
            sx={{ color: "#fff" }}
          />
          <Button
            onClick={handleCloseSlider}
            variant="contained"
            sx={{ mt: 2, bgcolor: "#fff", color: "orange" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WriterProfile;