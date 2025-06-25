import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Avatar,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import { CalendarToday, Person, Chat, ArrowBack, ArrowForward } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";
import OrderDetailsModal from "../OrderDetailsModel";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [writers, setWriters] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  // Get current date for calendar
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0-based (0 = January)
  const currentYear = today.getFullYear();

  // Calling dashboard API to get student dashboard
  const getStudentDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/students/dashboard`, {
        withCredentials: true,
      });
      console.log("Student Dashboard", response.data);
      if (response.data.success) {
        setWriters(response.data.writers);
        setOrders(
          response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setStatistics(response.data.statistics);
      } else {
        setError(response.data.message || "Failed to fetch dashboard!");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch dashboard!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentDashboard();
  }, []);

  // Handle opening/closing of OrderDetailsModel
  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Handle navigation to writer profile
  const handleWriterProfileClick = (writerId) => {
    navigate(`/admin/writer-profile/${writerId}`);
  };

  // Handle navigation to chat
  const handleChatClick = () => {
    navigate("/student/chat");
  };

  if (loading) {
    return <CircularProgressLoading />;
  } else if (error) {
    return <ErrorMessage message={error} onTryAgain={getStudentDashboard} />;
  } else {
    return (
      <Box sx={{ pt: 0, pl: 1, pr: 1, pb: 1, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Dashboard Title */}
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Dashboard
        </Typography>

        {/* Top Row */}
        <Grid container spacing={2} mb={2}>
          {/* Left Section */}
          <Grid item xs={12} md={7} lg={7}>
            <Box
              sx={{
                backgroundColor: "#073b4c",
                borderRadius: 2,
                mt: { xs: 0, sm: 0, md: -1, lg: -2, xl: -2 },
                p: 2,
                color: "white",
                height: { xs: "auto", lg: "180px" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={1}
                sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}
              >
                Hello {user ? user.name : "Student"},
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                  fontWeight: "300",
                  lineHeight: 1.4,
                }}
              >
                Welcome to your Student Dashboard where you can manage your activities,
                track progress, and stay connected.
              </Typography>
            </Box>
          </Grid>

          {/* Calendar Section */}
          <Grid item xs={12} md={5} lg={5}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
                ml: "auto",
                overflow: "hidden",
                mt: { xs: 1, sm: 1, md: -1, lg: -2, xl: -2 },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <IconButton size="small">
                  <ArrowBack />
                </IconButton>
                <Typography fontWeight="bold" sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(today)}
                </Typography>
                <IconButton size="small">
                  <ArrowForward />
                </IconButton>
              </Box>
              <Box
                display="grid"
                gridTemplateColumns="repeat(7, 1fr)"
                gap={0.5}
                sx={{
                  overflow: "hidden",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <Typography
                    key={day}
                    variant="caption"
                    textAlign="center"
                    sx={{
                      wordBreak: "keep-all",
                      fontSize: { xs: "10px", sm: "11px", md: "12px" },
                    }}
                  >
                    {day}
                  </Typography>
                ))}
                {[...Array(31)].map((_, index) => {
                  const day = index + 1;
                  const isCurrentDay =
                    day === currentDay &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  return (
                    <Button
                      key={index}
                      variant="text"
                      sx={{
                        minWidth: 30,
                        minHeight: 30,
                        color: isCurrentDay ? "white" : "black",
                        backgroundColor: isCurrentDay ? "darkred" : "transparent",
                        fontSize: { xs: "10px", sm: "11px", md: "12px" },
                        "&:hover": {
                          backgroundColor: isCurrentDay ? "darkred" : "#f0f0f0",
                        },
                      }}
                    >
                      {day}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* My Orders Section */}
        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ mt: -1 }}>
          My Orders
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                pt: 3,
                pl: 3,
                pr: 3,
                pb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                sx={{ flexShrink: 0 }}
              >
                {statistics.inProgressOrders || 0}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: "500" }}>In Progress Orders</Typography>
                <Chip
                  label={"In Progress"}
                  sx={{
                    color: "purple",
                    backgroundColor: "#f3e5f5",
                  }}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                pt: 3,
                pl: 3,
                pr: 3,
                pb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                sx={{ flexShrink: 0 }}
              >
                {statistics.completedOrders || 0}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: "500" }}>Completed Orders</Typography>
                <Chip
                  label={"Completed"}
                  sx={{
                    color: "green",
                    backgroundColor: "#e8f5e9",
                  }}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                pt: 3,
                pl: 3,
                pr: 3,
                pb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                sx={{ flexShrink: 0 }}
              >
                {statistics.revisionOrders || 0}
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: "500" }}>Revision Orders</Typography>
                <Chip
                  label={"Revision"}
                  sx={{
                    color: "orange",
                    backgroundColor: "#fff3e0",
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Order Details and My Writers Section */}
        <Grid container spacing={3}>
          {/* Order Details Section */}
          <Grid item xs={12} md={6} lg={8}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Order Details
            </Typography>
            {orders.length === 0 ? (
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                No Orders
              </Typography>
            ) : (
              orders.map((order) => (
                <Card
                  key={order._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 10, sm: 10, md: 11, lg: 16 },
                      height: { xs: 10, sm: 10, md: 11, lg: 16 },
                      backgroundColor:
                        order.status === "In Progress"
                          ? "#800080"
                          : order.status === "Completed"
                          ? "#008000"
                          : "#FFA500",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography sx={{ flex: 1, fontSize: { md: 12, lg: 16 } }}>
                    {order._id.slice(0, 5).toUpperCase()}
                  </Typography>
                  <Typography sx={{ flex: 2, fontWeight: "bold", fontSize: { md: 12, lg: 16 } }}>
                    {order.typeOfPaper}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: { md: 12, lg: 16 } }}>
                    {formatDate(order.deadline)}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#ff7a00",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "500",
                      mb: 1,
                      fontSize: { md: 11, lg: 13 },
                    }}
                    onClick={() => handleOpenOrderDetails(order)}
                  >
                    See Details
                  </Typography>
                </Card>
              ))
            )}
          </Grid>

          {/* My Writers Section */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              My Writers
            </Typography>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
              }}
            >
              {writers.length === 0 ? (
                <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                  No Writers
                </Typography>
              ) : (
                writers.map((writer) => (
                  <Box
                    key={writer._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar src={writer.avatar} alt={"W"} />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold" sx={{ fontSize: { md: 12, lg: 16 } }}>
                        {writer._id.slice(0, 5).toUpperCase()}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: { md: 12, lg: 14 } }}>
                        {writer.writingExpertise[0]}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{
                        backgroundColor: "#f3e5f5",
                        color: "#800080",
                        boxShadow: "0 2px 5px rgba(128, 0, 128, 0.2)",
                      }}
                      onClick={() => handleWriterProfileClick(writer._id)}
                    >
                      <Person />
                    </IconButton>
                    <IconButton
                      sx={{
                        backgroundColor: "#e8f5e9",
                        color: "#008000",
                        boxShadow: "0 2px 5px rgba(0, 128, 0, 0.2)",
                      }}
                      onClick={handleChatClick}
                    >
                      <Chat />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
            <Typography
              onClick={() => { navigate("/student/my-writers") }}
              sx={{
                cursor: "pointer",
                color: "#ff7a00",
                textDecoration: "underline",
                mt: 2,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              See More
            </Typography>
          </Grid>
        </Grid>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            open={!!selectedOrder}
            onClose={handleCloseOrderDetails}
            order={selectedOrder}
          />
        )}
      </Box>
    );
  }
};

export default StudentDashboard;