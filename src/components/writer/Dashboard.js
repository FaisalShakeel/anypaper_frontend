import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import {
  InsertDriveFile,
  PictureAsPdf,
  TableChart,
  Description,
  MoreHoriz,
  ArrowForward,
  Search,
} from "@mui/icons-material";
import WriterDashboardLayout from "../WriterDashboardLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment/moment";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import OrderDetailsModal from "../OrderDetailsModel";
import ErrorMessage from "../ErrorMessage";
import CircularProgressLoading from "../CircularProgress";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bidOrders, setBidOrders] = useState([]);
  const [filteredBidOrders, setFilteredBidOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [filteredAssignedOrders, setFilteredAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const paymentDetails = [
    { id: "101", type: "Essay", date: "02 Nov, 2024", method: "PayPal", price: "$30", status: "Pending" },
    { id: "102", type: "Research Paper", date: "03 Nov, 2024", method: "Solid Gate", price: "$40", status: "Paid" },
    { id: "103", type: "Lab Report", date: "04 Nov, 2024", method: "Stripe", price: "$20", status: "Pending" },
  ];

  const getIconByType = (type) => {
    switch (type) {
      case "pdf":
        return <PictureAsPdf sx={{ color: "#E57373", fontSize: 24 }} />;
      case "doc":
        return <Description sx={{ color: "#64B5F6", fontSize: 24 }} />;
      case "excel":
        return <TableChart sx={{ color: "#81C784", fontSize: 24 }} />;
      default:
        return <InsertDriveFile sx={{ color: "#BDBDBD", fontSize: 24 }} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getWriterDashboard = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/writers/dashboard`, {
        withCredentials: true,
      });
      console.log("Writer Dashboard", response.data);
      if (response.data.success) {
        const availableBidOrders = response.data.bidOrders
          .filter((order) => !order.bidders.some((bidder) => bidder._id === user?.id))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBidOrders(availableBidOrders);
        setFilteredBidOrders(availableBidOrders);
        setAssignedOrders(response.data.assignedOrders);
        setFilteredAssignedOrders(response.data.assignedOrders);
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
    getWriterDashboard();
  }, []);

  // Search functionality for both bid and assigned orders
  useEffect(() => {
    const filteredBids = bidOrders.filter((order) =>
      [order.typeOfPaper, order.fieldOfStudy].some(
        (field) => field && field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    const filteredAssigned = assignedOrders.filter((order) =>
      [order.typeOfPaper, order.fieldOfStudy].some(
        (field) => field && field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredBidOrders(filteredBids);
    setFilteredAssignedOrders(filteredAssigned);
  }, [searchQuery, bidOrders, assignedOrders]);

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
        <ErrorMessage message={error} onTryAgain={getWriterDashboard} />
      </WriterDashboardLayout>
    );
  }

  return (
    <WriterDashboardLayout>
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, display: "flex", bgcolor: "#f9f9f9", flexDirection: "column", gap: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "20px", sm: "25px" } }}>
              Dashboard
            </Typography>
            <ToastContainer />
            <TextField
              placeholder="Search by type or field..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      pr: 1.5,
                    }}
                  >
                    <Search />
                  </Box>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: "300px", md: "400px" },
                bgcolor: "#ffffff",
                borderRadius: 50,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  paddingRight: 0,
                },
                "& fieldset": { border: "none" },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3} justifyContent="space-between">
            {/* Left Section - Find Your Work */}
            <Grid item xs={12} lg={7}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "18px", sm: "20px" } }}>
                Find Your Work
              </Typography>
              {filteredBidOrders.length === 0 ? (
                <Typography variant="body1" textAlign="center" mb={3}>
                  No Orders
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {filteredBidOrders.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                        p: 2,
                        borderRadius: 2,
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, flex: 1 }}>
                        {getIconByType("pdf")}
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.typeOfPaper}
                        </Typography>
                      </Box>
                      <Box sx={{ width: "25%", textAlign: "center", minWidth: "100px" }}>
                        <Typography>{formatDate(item.deadline)}</Typography>
                      </Box>
                      <Box sx={{ width: "25%", textAlign: "center", minWidth: "80px" }}>
                        <Typography>${item.writerPrice.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ width: "10%", textAlign: "right", minWidth: "40px" }}>
                        <IconButton onClick={() => handleOpenDetails(item)}>
                          <MoreHoriz />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
              <Typography
                onClick={() => {
                  navigate("/writer/bid-orders");
                }}
                variant="body2"
                sx={{
                  mt: 2,
                  cursor: "pointer",
                  color: "#FF6F00",
                  textDecoration: "underline",
                  textAlign: "right",
                }}
              >
                See More
              </Typography>
            </Grid>

            {/* Right Section - My Orders */}
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "18px", sm: "20px" } }}>
                  My Orders
                </Typography>
                {filteredAssignedOrders.length === 0 ? (
                  <Typography variant="body1" textAlign="center" mb={3}>
                    No Orders
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {filteredAssignedOrders.map((order, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                          {getIconByType("pdf")}
                          <Box sx={{ overflow: "hidden" }}>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {order.typeOfPaper}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {moment(order.deadline).fromNow()}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton onClick={() => handleOpenDetails(order)}>
                          <ArrowForward />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Payment Details Section */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "18px", sm: "20px" } }}>
            Payment Details
          </Typography>
          <Table
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 3,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            <TableBody>
              {paymentDetails.map((detail, index) => (
                <TableRow key={index} sx={{ "&:not(:last-child)": { borderBottom: "1px solid #ddd" } }}>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {detail.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {detail.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {detail.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {detail.method}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {detail.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={detail.status}
                      sx={{
                        bgcolor: detail.status === "Paid" ? "#E8F5E9" : "#FFEBEE",
                        color: detail.status === "Paid" ? "#2E7D32" : "#C62828",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {selectedOrder && (
        <OrderDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          order={selectedOrder}
        />
      )}
    </WriterDashboardLayout>
  );
};

export default Dashboard;