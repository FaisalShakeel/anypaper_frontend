import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  Chip,
  Button,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Modal,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AssignOrderModel from "./ordermodels/AssignOrderModel";
import OrderBiddersModel from "./ordermodels/OrderBiddersModel";
import { useOrderContext } from "../../contexts/OrderContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

const AllOrders = () => {
  const { setOrders } = useOrderContext();
  const [allOrders, setAllOrders] = useState([]);
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [bidderListModelOpen, setBidderListModelOpen] = useState(false);
  const [assignOrderModelOpen, setAssignOrderModelOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState("");
  const STATUSES = [
    "All",
    "Completed",
    "In Revision",
    "Revision Sent Back",
    "Final Work Submitted",
    "Pending",
    "In Writing",
    "Student Requested Revision",
    "Assigned"
  ];
  const [filter1, setFilter1] = useState('All');
  const [filter2, setFilter2] = useState('All');
  const [filter3, setFilter3] = useState('None');
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  const tabLabels = [
    "All Orders",
    "New Orders",
    "Pending Orders",
    "Completed Orders",
    "Assigned Orders"
  ];

  const filteredOrders = allOrders.filter((order) => {
    console.log("Processing order:", order);

    let isIncluded = true;

    if (searchQuery && !order.typeOfPaper.toLowerCase().includes(searchQuery.toLowerCase())) {
      console.log("Excluded by searchQuery:", order.typeOfPaper);
      isIncluded = false;
    }

    if (filter1 !== "All") {
      if (filter1 === "Assigned") {
        console.log("Checking Assigned condition:", order.editorId && order.writerId);
        if (!(order.editorId && order.writerId)) isIncluded = false;
      } else if (filter1 === "New") {
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        const isNew = new Date(order.createdAt) >= sevenDaysAgo;
        console.log("Checking New condition:", isNew);
        if (!isNew) isIncluded = false;
      } else {
        console.log("Checking status condition:", order.status === filter1);
        if (order.status !== filter1) isIncluded = false;
      }
    }

    console.log("Reached filter3 logic");

    if (filter3 !== "None" && selectedDate) {
      console.log("Applying filter3:", filter3, selectedDate);

      const orderDate =
        filter3 === "Creation Date" && order.createdAt
          ? order.createdAt.split("T")[0]
          : filter3 === "Due Date" && order.deadline
          ? order.deadline.split("T")[0]
          : null;

      console.log("Order Date:", orderDate);
      console.log("Selected Date:", selectedDate);

      if (!orderDate || orderDate !== selectedDate) {
        console.log("Excluded by filter3:", orderDate, selectedDate);
        isIncluded = false;
      }
    }

    console.log("Final decision for order:", isIncluded ? "Included" : "Excluded");
    return isIncluded;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      setFilter1("All");
    } else if (newValue === 2) {
      setFilter1("Pending");
    } else if (newValue === 3) {
      setFilter1("Completed");
    } else if (newValue === 1) {
      setFilter1("New");
    } else if (newValue === 4) {
      setFilter1("Assigned");
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getAllOrders = async () => {
    setLoading(true);
    console.log("Get Orders", process.env.REACT_APP_GET_ALL_ORDERS);
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_ALL_ORDERS}`, { withCredentials: true });
      console.log("All orders", response.data);
      if (response.data.success) {
        setOrders(
          response.data.orders.totalOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setAllOrders(
          response.data.orders.totalOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setPendingOrders(
          response.data.orders.pendingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setNewOrders(
          response.data.orders.newOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setCompletedOrders(
          response.data.orders.completedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setError(""); // Clear any previous error
      } else {
        setError(response.data.message || "Failed to fetch orders!");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter1 === "All") {
      setSelectedTab(0);
    } else if (filter1 === "Pending") {
      setSelectedTab(2);
    } else if (filter1 === "Completed") {
      setSelectedTab(3);
    } else if (filter1 === "Assigned") {
      setSelectedTab(4);
    } else if (filter1 === "New") {
      setSelectedTab(1);
    } else {
      setSelectedTab(5);
    }
  }, [filter1]);

  useEffect(() => {
    getAllOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
        <CircularProgressLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
        <ErrorMessage message={error} onTryAgain={getAllOrders} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000", fontSize: "1.8rem" }}>
        Orders
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="none"
        sx={{
          mt: 2,
          "& .MuiTabs-flexContainer": { flexWrap: "wrap", gap: 1 },
        }}
      >
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            sx={{
              textTransform: "none",
              px: 2,
              py: 1,
              border: "1px solid orange",
              borderRadius: 10,
              color: selectedTab === index ? "#fff" : "#000",
              backgroundColor: selectedTab === index ? "orange" : "transparent",
              fontSize: "0.9rem",
            }}
          />
        ))}
      </Tabs>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
          gap: 2,
          mt: 2,
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
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
              fontSize: "0.9rem",
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
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              fontSize: "0.9rem",
            }}
          >
            {STATUSES.map((status) => (
              <MenuItem value={status} sx={{ fontSize: "0.9rem" }}>{status}</MenuItem>
            ))}
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
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              fontSize: "0.9rem",
            }}
          >
            <MenuItem value="None" onClick={() => setDateModelOpen(false)} sx={{ fontSize: "0.9rem" }}>None</MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Creation Date" sx={{ fontSize: "0.9rem" }}>
              Creation Date
            </MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Due Date" sx={{ fontSize: "0.9rem" }}>
              Due Date
            </MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          pr: { xs: 0, md: 8, lg: 15 },
        }}
      >
        {filteredOrders.map((order, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                bgcolor: `${order.color}11`,
                width: "95%",
                height: "230px",
                mx: "auto",
                "&:hover": {
                  boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
                  transform: "translateY(-5px)",
                  transition: "0.3s",
                },
             

              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold", color: "#000", fontSize: "0.9rem" }}>
                  #{order._id.slice(0, 4).toUpperCase()}
                </Typography>
                <Chip
                  label={order.status}
                  sx={{
                    bgcolor: (theme) => {
                      switch (order.status) {
                        case "Completed":
                        case "Final Work Submitted":
                          return theme.palette.success.light + "33";
                        case "Pending":
                        case "Revision Sent Back":
                        case "Student Requested Revision":
                          return theme.palette.warning.light + "33";
                        case "In Writing":
                        case "In Revision":
                          return theme.palette.info.light + "33";
                        default:
                          return theme.palette.grey[200];
                      }
                    },
                    color: (theme) => {
                      switch (order.status) {
                        case "Completed":
                        case "Final Work Submitted":
                          return theme.palette.success.dark;
                        case "Pending":
                        case "Revision Sent Back":
                        case "Student Requested Revision":
                          return theme.palette.warning.dark;
                        case "In Writing":
                        case "In Revision":
                          return theme.palette.info.dark;
                        default:
                          return theme.palette.grey[800];
                      }
                    },
                    borderRadius: 8,
                    fontSize: "0.8rem",
                  }}
                />
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ mt: 1, fontWeight: "bold", color: "#333", fontSize: "1rem" }}
              >
                {order.typeOfPaper}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 0.5,
                  color: "#666",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {order.studentName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography sx={{ fontWeight: "bold", color: "#000", fontSize: "0.9rem" }}>
                  ${order.studentPrice.toFixed(2)}
                </Typography>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOrder(order);
                    setBidderListModelOpen(true);
                  }}
                  variant="outlined"
                  sx={{
                    width: "130px",
                    height: "40px",
                    border: "1px solid orange",
                    color: "#666",
                    fontWeight: "normal",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "orange",
                      color: "#fff",
                    },
                    fontSize: "0.9rem",
                  }}
                >
                  View Details
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", mt: "auto", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ mt: 5, fontSize: "0.8rem" }}>
                  Deadline: {formatDate(order.deadline)}
                </Typography>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOrder(order);
                    setAssignOrderModelOpen(true);
                  }}
                  variant="outlined"
                  sx={{
                    width: "130px",
                    height: "40px",
                    mt: 1,
                    border: "1px solid orange",
                    color: "#666",
                    fontWeight: "normal",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "orange",
                      color: "#fff",
                    },
                    fontSize: "0.9rem",
                  }}
                >
                  Assign Order
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {Object.keys(order).length > 0 ? (
        <OrderBiddersModel order={order} open={bidderListModelOpen} onClose={() => setBidderListModelOpen(false)} />
      ) : (
        <></>
      )}
      <AssignOrderModel open={assignOrderModelOpen} order={order} handleClose={() => setAssignOrderModelOpen(false)} />

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
          <Typography
            variant="h6"
            sx={{ color: "orange", marginBottom: 2, fontWeight: "bold", fontSize: "1.2rem" }}
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
                  fontSize: "0.9rem",
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
    </Box>
  );
};

export default AllOrders;