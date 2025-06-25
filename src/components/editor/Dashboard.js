import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Rating,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getEditorDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/editors/dashboard`,
        { withCredentials: true }
      );
      console.log("Editor Dashboard", response.data);
      if (response.data.success) {
        setWriters(response.data.writers);
        setOrders(
          response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
        toast.error(response.data.message || 'Failed to fetch dashboard data', { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast.error(errorMessage, { style: { fontWeight: "bold" } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEditorDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, minHeight: '100vh' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <ErrorMessage message={error} onTryAgain={getEditorDashboard} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", minHeight: "100vh", maxWidth: "100%", boxSizing: "border-box" }}>
      <ToastContainer />
      {/* Top Highlight Section */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "start" }}
      >
        Writer's Analytics
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={3}>
        {writers.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
              No Writers
            </Typography>
          </Grid>
        ) : (
          writers.map((writer, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                sx={{
                  backgroundColor: "white",
                  padding: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#fafafa",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 60, height: 60 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      {writer.name ? writer.name : writer._id?.slice(0, 5).toUpperCase() || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="h6" fontWeight="bold" fontSize={13}>
                    Orders Completed
                  </Typography>
                  <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <Typography component="span" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      {writer.completedOrders || 0}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: "16px" }}>
                      /
                    </Typography>
                    <Typography component="span" sx={{ fontSize: "16px", marginTop: "4px", display: "inline-block" }}>
                      {writer.totalOrders || 0}
                    </Typography>
                  </Typography>
                  <Rating
                    value={writer.rating || 0}
                    precision={0.5}
                    readOnly
                    sx={{ color: "orange" }}
                  />
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Second Row Section */}
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        {/* Left Section */}
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            Order Details
          </Typography>
          <Card
            sx={{
              backgroundColor: "white",
              boxShadow: 10,
              borderRadius: 2,
              padding: 2,
              height: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {orders.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: "center", color: "gray", padding: 2 }}>
                No Orders
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Deadline</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{order._id?.slice(0, 5).toUpperCase() || 'N/A'}</TableCell>
                      <TableCell>{order.typeOfPaper || 'Unknown'}</TableCell>
                      <TableCell>{order.deadline ? formatDate(order.deadline) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: 2,mt:{xs:3,md:0} }}
          >
            Order Analytics
          </Typography>
          <Card
            sx={{
              backgroundColor: "white",
              boxShadow: 3,
              borderRadius: 2,
              padding: 2,
              height: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ position: "relative", height: 250, marginTop: 2 }}>
              {/* Y-Axis Labels */}
              {Array.from({ length: 5 }).map((_, index) => (
                <Typography
                  key={index}
                  sx={{
                    position: "absolute",
                    left: "10px",
                    top: `${50 - index * 20}%`,
                    fontSize: "14px",
                    color: "gray",
                  }}
                >
                  {index * 10}
                </Typography>
              ))}

              {/* "This Week" Horizontal Line */}
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "5%",
                  right: "5%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "orange",
                  }}
                />
                <Typography
                  sx={{
                    marginX: 1,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "orange",
                  }}
                >
                  This Week
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "orange",
                  }}
                />
              </Box>

              {/* Graph Bars */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: `${index * 14

 + 10}%`,
                    width: 20,
                    height: `${Math.random() * 50 + 10}%`,
                    backgroundColor: "orange",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      right: "-25px",
                      top: "-30%",
                      backgroundColor: "orange",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.floor(Math.random() * 50) + 1}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* X-Axis Days */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
                paddingLeft: "10%",
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <Typography key={index} sx={{ fontSize: "12px" }}>
                  {day}
                </Typography>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;