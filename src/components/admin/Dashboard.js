import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [topStudents, setTopStudents] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [error, setError] = useState("");

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [10000, 20000, 15000, 30000, 25000, 35000, 40000],
        borderColor: "orange",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value / 1000}k`, // Format y-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getAdminDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/admins/dashboard`, { withCredentials: true });
      console.log("Admin Dashboard Response", response.data);
      if (response.data.success) {
        setLatestOrders(
          response.data.latestOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setTopStudents(response.data.topStudents);
        setTopWriters(response.data.topWriters);
        setError(""); // Clear any previous error
      } else {
        setError(response.data.message || "Failed to fetch dashboard");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: "#f9f9f9" }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: "#f9f9f9" }}>
        <ErrorMessage message={error} onTryAgain={getAdminDashboard} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100%", maxWidth: "100%" }}>
      {/* Welcome Section */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Welcome Back Admin
      </Typography>

      {/* Top Writers Section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Top Writers
        </Typography>
        <Grid container spacing={2}>
          {topWriters.map((writer, index) => (
            <Grid item xs={12} md={2} lg={4} key={index}>
              <Card
                sx={{
                  p: 2,
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  position: "relative",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>W</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {writer.name ? writer.name : writer._id.slice(0, 5).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {writer.writingExpertise[0]}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {writer.rating}
                    </Typography>
                    <StarIcon sx={{ color: "orange", fontSize: "16px", ml: 0.5 }} />
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    $0
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Students Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Students
        </Typography>
        <Grid container spacing={2}>
          {topStudents.map((student, index) => (
            <Grid item xs={12} md={4} lg={3} key={index}>
              <Card
                sx={{
                  p: 2,
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders <span style={{ fontWeight: "bold" }}>({student.orderCount})</span>
                  </Typography>
                </Box>
                <IconButton>
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Orders and Financial Report */}
      <Grid container spacing={2} sx={{ mt: 5 }}>
        {/* Latest Orders Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#fff",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Latest Orders
            </Typography>
            <Box>
              {latestOrders.map((order, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      flexWrap: { xs: "wrap", md: "nowrap" },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                      >
                        {order._id.slice(0, 5).toUpperCase()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      >
                        {order.typeOfPaper}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      >
                        {formatDate(order.deadline)}
                      </Typography>
                      <ArrowForwardIosIcon
                        fontSize="small"
                        sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Financial Report Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#fff",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                color="orange"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                This Week
              </Typography>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
                >
                  Total Orders
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  278
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
                >
                  Total Students: 200
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              Total Revenue
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 1, fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              $34,545.45
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              288 Orders
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: { xs: 150, md: 200 }, width: "100%" }}>
              <Line
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;