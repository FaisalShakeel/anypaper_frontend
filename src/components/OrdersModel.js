import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OrdersModal = ({ open, onClose, orders }) => {
 

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="orders-modal"
      aria-describedby="orders-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          width: { xs: "90%", md: "90%" },
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <ToastContainer />
        <Typography
          id="orders-modal"
          variant="h6"
          fontWeight="bold"
          align="center"
          sx={{ mb: 2 }}
        >
          Orders Overview
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          View details of your orders below.
        </Typography>

        {orders?.length==0?<Typography>No Orders!</Typography>: (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type of Paper</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Academic Level</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Field of Study</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(orders || []).map((order, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <TableCell>{order._id?.slice(0, 5) || "N/A"}</TableCell>
                    <TableCell>{order.typeOfPaper || "Unknown"}</TableCell>
                    <TableCell>{order.academicLevel || "Unknown"}</TableCell>
                    <TableCell>{order.fieldOfStudy || "Unknown"}</TableCell>
                    <TableCell>
                      {order.deadline
                        ? new Date(order.deadline).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: "orange",
              color: "white",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              borderRadius: 2,
              px: 3,
              py: 0.5,
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrdersModal;