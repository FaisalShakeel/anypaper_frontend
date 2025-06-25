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
import { useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import OrdersModel from "./ordermodels/OrdersModel";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const EditorProfile = () => {
  const { id } = useParams();
  const [openOrdersModel, setOpenOrdersModel] = useState(false);
  const [editor, setEditor] = useState({});
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  const handleOpenOrdersModel = () => setOpenOrdersModel(true);
  const handleCloseOrdersModel = () => setOpenOrdersModel(false);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getEditorProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_EDITOR_PROFILE}/${id}`,
        { withCredentials: true }
      );
      console.log("Editors Profile", response.data);
      if (response.data.success) {
        setEditor(response.data.editor);
        setStatistics(response.data.statistics);
        setOrders(response.data.orders);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch editor profile');
        toast.error(response.data.message, { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch editor profile';
      setError(errorMessage);
      toast.error(errorMessage, { style: { fontWeight: "bold" } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEditorProfile();
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
        <ErrorMessage message={error} onTryAgain={getEditorProfile} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <ToastContainer />
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
            alt={editor.fullName ? editor.fullName[0] : ''}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {editor._id ? editor._id.slice(0, 5).toUpperCase() : ''}
            </Typography>
            <Typography sx={{ color: "#555" }}>{editor.fullName}</Typography>
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
                onClick={handleOpenOrdersModel}
              >
                Assign Order
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
            <Typography sx={{ color: "#555" }}>{editor.gender}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Email:</Typography>
            <Typography sx={{ color: "#555" }}>{editor.email}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Phone Number:</Typography>
            <Typography sx={{ color: "#555" }}>{editor.phoneNumber}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Joined Since:</Typography>
            <Typography sx={{ color: "#555" }}>
              {editor.createdAt ? formatDate(editor.createdAt) : ''}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Rating:</Typography>
            <Typography sx={{ color: "#555" }}>{editor.rating}/5</Typography>
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
              {statistics.totalOrders}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUpIcon sx={{ color: "green" }} />
              <Typography sx={{ ml: 1, color: "green" }}>
                {statistics.growthPercentage}
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
              {statistics.completedOrders}
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
              {statistics.pendingOrders}
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
              {statistics.withoutRevisionsOrders}
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
      <OrdersModel
        open={openOrdersModel}
        onClose={handleCloseOrdersModel}
        editorId={id}
      />
    </Box>
  );
};

export default EditorProfile;