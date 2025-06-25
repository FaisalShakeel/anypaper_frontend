import React from "react";
import { Box, Typography, Modal, Grid, Button } from "@mui/material";

const OrderDetailsModal = ({ open, onClose, order }) => {
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "downloaded-file";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url); // Cleanup
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="order-details-modal"
      aria-describedby="order-details-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: { xs: 2, sm: 3 }, // Responsive padding
          borderRadius: 3,
          width: {xs:"85%",md:"90%"},
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Status Chip - Positioned at top right */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            px: 2,
            py: 0.5,
            borderRadius: "12px",
            // Dynamic background based on status with transparency
            bgcolor: order.status === "Pending" 
              ? "rgba(255, 105, 180, 0.2)" // Light pink background for Pending
              : order.status === "Completed"
              ? "rgba(46, 125, 50, 0.2)" // Light green background for Completed
              : order.status === "In Revision"
              ? "rgba(239, 108, 0, 0.2)" // Light orange background for In Revision
              : "rgba(224, 224, 224, 0.2)", // Light gray for default
            // Dynamic shadow based on status
            boxShadow: order.status === "Pending"
              ? "0 2px 6px rgba(255, 105, 180, 0.5)" // Pink shadow
              : order.status === "Completed"
              ? "0 2px 6px rgba(46, 125, 50, 0.5)" // Green shadow
              : order.status === "In Revision" 
              ? "0 2px 6px rgba(239, 108, 0, 0.5)" // Orange shadow
              : "0 2px 6px rgba(0, 0, 0, 0.1)", // Default shadow
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              fontWeight: 500,
              // Slightly darker text color based on status
              color: order.status === "Pending" 
                ? "#ff1493" // Darker pink text
                : order.status === "Completed"
                ? "#1b5e20" // Darker green text
                : order.status === "In Revision"
                ? "#e65100" // Darker orange text
                : "#616161", // Dark gray for default
            }}
          >
            {order.status}
          </Typography>
        </Box>

        {/* Add some space at the top to prevent overlap with the status chip */}
        <Box sx={{ mt: 3 }} />

        {/* Grid Layout for Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              Order ID:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>{order._id}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              Type of Paper:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>{order.typeOfPaper}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              Academic Level:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>{order.academicLevel}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              Field of Study:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>
                {order.fieldOfStudy || "Not specified"}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              No. of Sources:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>
                {order.noOfSources || "Not specified"}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
              Reference Style:
              <span style={{ fontWeight: "400", marginLeft: "4px" }}>
                {order.referenceStyle || "Not specified"}
              </span>
            </Typography>
          </Grid>
        </Grid>

        {/* Start Date and Deadline */}
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
            Start Date:
            <span style={{ fontWeight: "400", marginLeft: "4px" }}>{formatDate(order.createdAt)}</span>
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" }, mt: 1 }}>
            Deadline:
            <span style={{ fontWeight: "400", marginLeft: "4px" }}>{formatDate(order.deadline)}</span>
          </Typography>
        </Box>

        {/* Attachments */}
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
            Attachments:
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            {order.materialFile ? (
              <>
                <span>{order.materialFile?.name}</span>
                {/* Download Material Button */}
                <Button
                  
                onClick={()=>{handleDownload(order.materialFile.url,order.materialFile.name)}}
                  
                  variant="contained"
                  sx={{
                    mt: 1,
                    display: "block",
                    bgcolor: "orange",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    borderRadius: 2,
                    px: 3,
                    py: 0.5,
                
                  }}
                >
                  Download Material
                </Button>
              </>
            ) : (
              "No attachments"
            )}
          </Typography>
        </Box>

        {/* Instructions */}
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
            Instructions:
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            {order.otherInstructions || "No additional instructions"}
          </Typography>
        </Box>

        {/* Buttons Container - Align Buttons Side by Side */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {/* Close Button */}
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

export default OrderDetailsModal;