import React, { useEffect, useState } from "react";
import { Box, Typography, Button, useMediaQuery, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";

import moment from "moment/moment";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const OverdueTasks = () => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifying, setNotifying] = useState({}); // Track notifying state for each order
  const isMobile = useMediaQuery("(max-width:600px)");

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getOverdueTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/admins/overdue-tasks`,
        { withCredentials: true }
      );
      console.log("Overdue Tasks", response.data);
      if (response.data.success) {
        setOverdueTasks(response.data.overdueTasks);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch overdue tasks');
        toast.error(response.data.message);
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to fetch overdue tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const notifyDeadline = async (orderId) => {
    setNotifying((prev) => ({ ...prev, [orderId]: true }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/notify-deadline/${orderId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Notifications sent successfully!");
      } else {
        toast.error(response.data.message || "Failed to send notifications");
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || "Failed to send notifications";
      toast.error(errorMessage);
    } finally {
      setNotifying((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    getOverdueTasks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, bgcolor: 'white', minHeight: '100vh' }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, bgcolor: 'white', minHeight: '100vh' }}>
        <ErrorMessage message={error} onTryAgain={getOverdueTasks} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, bgcolor: "white", minHeight: "100vh" }}>
      {/* Heading */}
      <ToastContainer/>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
          color: "black",
        }}
      >
        Overdue Tasks
      </Typography>

      {/* Table Headers (Always Visible) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
          marginBottom: 2,
          textAlign: "left",
          fontWeight: "bold",
          color: "black",
          padding: 2,
          borderBottom: "2px solid #ddd",
        }}
      >
        <Typography variant="caption">ID</Typography>
        <Typography variant="caption">Order Name</Typography>
        <Typography variant="caption">Deadline</Typography>
        <Typography variant="caption">Price</Typography>
        <Typography variant="caption">Overdue</Typography>
      </Box>

      {/* If tasks exist, show them, otherwise show a message */}
      {overdueTasks.length > 0 ? (
        overdueTasks.map((task) => (
          <Box
            key={task._id}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              padding: 2,
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              {task._id?.slice(0, 5).toUpperCase() || 'N/A'}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              {task.typeOfPaper || 'Unknown'}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              {task.deadline ? formatDate(task.deadline) : 'N/A'}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              {task.studentPrice || 'N/A'}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: "14px", color: "black", marginRight: 2 }}>
                {task.deadline ? moment(new Date(task.deadline)).fromNow() : 'N/A'}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#FFB74D",
                  color: "white",
                  textTransform: "none",
                  fontSize: "12px",
                  padding: "6px 16px",
                  "&:hover": { bgcolor: "#FFA726" },
                  minWidth: "80px",
                }}
                onClick={() => notifyDeadline(task._id)}
                disabled={notifying[task._id]}
              >
                {notifying[task._id] ? (
                  <CircularProgress
                    sx={{ color: "white", width: "20px !important", height: "20px !important" }}
                  />
                ) : (
                  "Notify"
                )}
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            color: "black",
            fontSize: "16px",
            padding: 2,
          }}
        >
          No overdue tasks!
        </Typography>
      )}
    </Box>
  );
};

export default OverdueTasks;