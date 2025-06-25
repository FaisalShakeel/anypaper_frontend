import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  Collapse,
  Grid,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useOrderContext } from "../../../contexts/OrderContext";

const OrdersModel = ({ open, onClose, editorId }) => {
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isAssigningOrder, setIsAssigningOrder] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order
  const { orders, setOrders } = useOrderContext(); // Destructure setOrders from context

  const handleOrderSelection = (order) => {
    if (expandedOrderId === order._id) {
      setExpandedOrderId(null); // Collapse if already expanded
    } else {
      setExpandedOrderId(order._id); // Expand the clicked order
    }
    setSelectedOrder(order);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const assignOrder = async () => {
    if (selectedOrder.editorId) {
      toast.error("Order Already Assigned!");
      return;
    }
    setIsAssigningOrder(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_ASSIGN_ORDER_TO_EDITOR}/${selectedOrder._id}`,
        { editorId },
        { withCredentials: true }
      );
      console.log("Assign Order Response", response.data);
      if (response.data.success) {
        toast.success("Editor Assigned Successfully!");
        // Update the orders state by setting editorId for the selected order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, editorId: editorId } // Update editorId
              : order
          )
        );
        setSelectedOrder({ ...selectedOrder, editorId: editorId }); // Update selectedOrder state
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsAssigningOrder(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  if (!orders) {
    return (
      <Box>
        Orders Model
      </Box>
    );
  }

  // Filter orders that are not assigned to an editor and are not in Submitted or Completed status
  const filteredOrders = orders.filter(
    (order) => !order.editorId && order.status !== "Submitted" && order.status !== "Completed"
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="order-bidders-modal"
      aria-describedby="order-bidders-list"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          borderRadius: 3,
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a8a8a8",
          },
        }}
      >
        <ToastContainer />

        {/* Orders List */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            mt: 2,
          }}
        >
          All Orders
        </Typography>

        {/* No Orders Message */}
        {filteredOrders.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              mt: 2,
              bgcolor: "#f9f9f9",
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#666",
              }}
            >
              No Orders To Assign
            </Typography>
          </Box>
        )}

        {/* Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredOrders.map((order) => (
            <Box
              key={order._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                borderRadius: 2,
                boxShadow:
                  selectedOrder._id === order._id
                    ? "0 0 0 1px orange"
                    : "0 1px 1px rgba(0, 0, 0, 0.1)",
                bgcolor: "white",
                cursor: "pointer",
              }}
              onClick={() => handleOrderSelection(order)}
            >
              {/* Order Summary */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 4, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      width: "20%",
                    }}
                  >
                    {order._id.slice(0, 5).toUpperCase()}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontSize: "0.85rem",
                      color: "gray",
                      width: "40%",
                    }}
                  >
                    {order.typeOfPaper}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontSize: "0.85rem",
                      color: "gray",
                      width: "30%",
                    }}
                  >
                    {formatDate(order.deadline)}
                  </Typography>
                </Box>

                <ArrowForwardIosIcon
                  sx={{
                    fontSize: 16,
                    color: "gray",
                    transform: expandedOrderId === order._id ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </Box>

              {/* Expanded Order Details */}
              <Collapse in={expandedOrderId === order._id}>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderTop: "1px solid #e0e0e0",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <Grid container spacing={2}>
                    {/* No of Sources */}
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        No of Sources:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#555" }}>
                        {order.noOfSources}
                      </Typography>
                    </Grid>

                    {/* Reference Style */}
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        Reference Style:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#555" }}>
                        {order.referenceStyle}
                      </Typography>
                    </Grid>

                    {/* Field of Study */}
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        Field of Study:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#555" }}>
                        {order.fieldOfStudy}
                      </Typography>
                    </Grid>

                    {/* Academic Level */}
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        Academic Level:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#555" }}>
                        {order.academicLevel}
                      </Typography>
                    </Grid>

                    {/* Order Status with dynamic color */}
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        Status:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color:
                            order.status === "Completed"
                              ? "green"
                              : order.status === "Pending"
                              ? "orange"
                              : "red",
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>

        {/* Buttons */}
        <Box>
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              mt: 3,
              ml: "auto",
              display: "block",
              bgcolor: "orange",
              color: "white",
              fontSize: "0.85rem",
              borderRadius: 2,
              px: 3,
              py: 0.5,
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Close
          </Button>

          {/* Assign Order Button */}
          {Object.keys(selectedOrder).length !== 0 && (
            <Button
              onClick={assignOrder}
              disabled={isAssigningOrder}
              variant="contained"
              sx={{
                mt: 3,
                ml: "auto",
                display: "block",
                bgcolor: "orange",
                color: "white",
                fontSize: "0.85rem",
                borderRadius: 2,
                px: 3,
                py: 0.5,
                "&:hover": { bgcolor: "darkorange" },
              }}
            >
              {isAssigningOrder ? "Assigning..." : "Assign Now"}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default OrdersModel;