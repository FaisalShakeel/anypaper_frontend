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
  CircularProgress,
  Rating,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RatingsModal = ({ open, onClose, ratings }) => {
 
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="ratings-modal"
      aria-describedby="ratings-modal-description"
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
          id="ratings-modal"
          variant="h6"
          fontWeight="bold"
          align="center"
          sx={{ mb: 2 }}
        >
          Ratings Overview
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          View ratings and details submitted by users.
        </Typography>

        {ratings?.length==0?<Typography>No Ratings Yet!</Typography> : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="ratings table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rater ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                 
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(ratings || []).map((rating, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <TableCell>{rating.raterName || rating.raterId?.slice(0, 5).toUpperCase() || "Anonymous"}</TableCell>
                    <TableCell>
                      <Rating
                        value={rating.value || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {rating.value ? rating.value.toFixed(1) : "N/A"}
                      </Typography>
                    </TableCell>
                   
                    <TableCell>
                      {rating.createdAt
                        ? new Date(rating.createdAt).toLocaleDateString()
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

export default RatingsModal;