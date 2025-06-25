import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Button,
  Divider,
  TextField,
  MenuItem,
  Select,
  CircularProgress,
  InputAdornment,
  Modal,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";
import WriterDashboardLayout from "../WriterDashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import { useOrderContext } from "../../contexts/OrderContext";
import moment from "moment/moment";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import OrderDetailsModal from "../OrderDetailsModel";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const BidOrders = () => {
  const [loading, setLoading] = useState(true);
  const { orders } = useOrderContext();
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filter1, setFilter1] = useState("All");
  const [filter3, setFilter3] = useState("None");
  const [bidOrders, setBidOrders] = useState([]);
  const [isBidding, setIsBidding] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  const filteredOrders = bidOrders.filter((order) => {
    // Filter out orders that have a writerId assigned
    if (order.writerId) {
      return false;
    }

    if (searchQuery && !order.typeOfPaper.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
  
    const bidders = Array.isArray(order.bidders) ? order.bidders : [];
  
    if (filter1 !== "All") {
      if (filter1 === "Available For Bidding") {
        if (bidders.some((bidder) => bidder._id === user.id)) {
          return false;
        }
      } else if (filter1 === "Already Bidded") {
        if (!bidders.some((bidder) => bidder._id === user.id)) {
          return false;
        }
      }
    }
  
    if (filter3 !== "None" && selectedDate) {
      const orderDate =
        filter3 === "Creation Date" && order.createdAt
          ? order.createdAt.split("T")[0]
          : filter3 === "Due Date" && order.deadline
          ? order.deadline.split("T")[0]
          : null;
  
      if (!orderDate || orderDate !== selectedDate) {
        return false;
      }
    }
  
    return true;
  });
  
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const formatTime = (dateString) => {
    return moment(dateString).format("h:mm A");
  };

  const bidOnOrder = async (orderId) => {
    setSelectedOrderId(orderId);
    setIsBidding(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/bid/${orderId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setBidOrders((prevBidOrders) =>
          prevBidOrders.map((order) =>
            order._id === orderId
              ? { ...order, bidders: [...(order.bidders || []), { _id: user?.id }] }
              : order
          )
        );
      } else {
        console.error(response.data);
        toast.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsBidding(false);
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_ALL_ORDERS}`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setBidOrders(
          response.data.orders.pendingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setError(""); // Clear any previous error
      } else {
        setError(response.data.message || "Failed to fetch bid orders!");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to fetch bid orders!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <WriterDashboardLayout>
        <CircularProgressLoading />
      </WriterDashboardLayout>
    );
  }

  if (error) {
    return (
      <WriterDashboardLayout>
        <ErrorMessage message={error} onTryAgain={getAllOrders} />
      </WriterDashboardLayout>
    );
  }

  return (
    <WriterDashboardLayout>
      <Box sx={{ p: 4, bgcolor: "#f9f9f9", mt: -2 }}>
        <ToastContainer />
        <Box sx={{ textAlign: "left", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Bid Orders
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5, fontWeight: "bold" }}>
            Bid on orders and secure your next job
          </Typography>
        </Box>
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
            placeholder="Search Topic and Subject"
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
              width: { xs: "100%", sm: "100%", md: "100%", lg: "500px" },
              bgcolor: "#fff",
              borderRadius: "50px",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                height: "40px",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr", lg: "1fr 1fr" },
              gap: 2,
              width: "100%",
            }}
          >
            <Select
              value={filter1}
              onChange={(e) => setFilter1(e.target.value)}
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "50px",
                width: "100%",
                height: "40px",
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Available For Bidding">Available For Bidding</MenuItem>
              <MenuItem value="Already Bidded">Already Bidded</MenuItem>
            </Select>
            <Select
              value={filter3}
              onChange={(e) => {
                const newValue = e.target.value;
                setFilter3(newValue);
              }}
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "50px",
                width: "100%",
                height: "40px",
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="None" onClick={() => setDateModelOpen(false)}>None</MenuItem>
              <MenuItem onClick={() => setDateModelOpen(true)} value="Creation Date">
                Creation Date
              </MenuItem>
              <MenuItem onClick={() => setDateModelOpen(true)} value="Due Date">
                Due Date
              </MenuItem>
            </Select>
          </Box>
        </Box>
        <Grid container spacing={2} justifyContent="start" alignItems="start">
          {filteredOrders.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <Typography sx={{ fontWeight: 500, textAlign: "center" }}>No Orders!</Typography>
            </Box>
          ) : (
            filteredOrders.map((order, index) => (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                  sx={{
                    width: "95%",
                    p: 2,
                    borderRadius: 3,
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.1), 4px 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", textAlign: "start", mb: 2 }}>
                    <PictureAsPdf />
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", width: "100%", mt: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {order.studentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginLeft: "10px" }}>
                        {moment(new Date(order.deadline)).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}>
                    {order.typeOfPaper}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Chip
                      label={order.academicLevel}
                      sx={{ bgcolor: "#F5F5F5", color: "#616161", borderRadius: 1 }}
                    />
                    <Chip
                      label={order.quantity}
                      sx={{ bgcolor: "#F5F5F5", color: "#616161", borderRadius: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(105, 160, 255, 0.7)",
                        textDecoration: "underline",
                        cursor: "pointer",
                        mb: 1,
                      }}
                      onClick={() => handleOpenDetails(order)}
                    >
                      more details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2, bgcolor: "#E0E0E0" }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 0 }}>
                        ${order.writerPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "11px", mt: 0.2 }} color="text.secondary">
                        Due: {formatDate(order.deadline)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "11px", display: "block", mt: 0.2 }} color="text.secondary">
                        {formatTime(order.deadline)}
                      </Typography>
                    </Box>
                    <Button
                      disabled={isBidding || order.bidders.some((bidder) => bidder._id === user?.id)}
                      onClick={(e) => {
                        e.preventDefault();
                        bidOnOrder(order._id);
                      }}
                      variant="contained"
                      sx={{
                        bgcolor: "#FFA726",
                        color: "white",
                        borderRadius: 1,
                        "&:hover": { bgcolor: "#FFA726" },
                      }}
                    >
                      {order.bidders.some((bidder) => bidder._id === user?.id)
                        ? "Bidded"
                        : isBidding && selectedOrderId === order._id
                        ? <CircularProgress sx={{ height: "9px", width: "9px", color: "orange" }} thickness={10} />
                        : "Bid Now"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <Modal open={dateModelOpen} onClose={() => setDateModelOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "70%", md: "40%" },
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "orange", marginBottom: 2, fontWeight: "bold" }}>
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
                    borderRadius: "8px",
                  },
                  "& fieldset": { borderColor: "#FF6F00" },
                  "&:hover fieldset": { borderColor: "#FF9800" },
                  "&.Mui-focused fieldset": { borderColor: "#FF6F00" },
                  marginBottom: 3,
                }}
              />
            </Grid>
          </Box>
        </Modal>
        
        {selectedOrder && (
          <OrderDetailsModal
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            order={selectedOrder}
          />
        )}
      </Box>
    </WriterDashboardLayout>
  );
};

export default BidOrders;