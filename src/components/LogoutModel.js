import React from "react";
import { Modal, Box, Typography, CircularProgress, Backdrop } from "@mui/material";

const LogoutModal = ({ open }) => {
  return (
    <Modal
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: "rgba(0, 0, 0, 0.6)" }, // Soft dark overlay
      }}
      aria-labelledby="logout-modal"
    >
      <Box
        sx={{
          width: 380,
          bgcolor: "rgba(255, 255, 255, 0.9)", // Glassmorphic effect
          p: 4,
          mx: "auto",
          mt: "25vh",
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // Soft shadow
          textAlign: "center",
          backdropFilter: "blur(10px)", // Smooth blur effect
          animation: "fadeIn 0.5s ease-in-out", // Smooth appearance animation
        }}
      >
        <CircularProgress
          size={40}
          thickness={5}
          sx={{
            color: "orange",
            mb: 2,
            animation: "spin 1s linear infinite",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "15px",
          }}
        >
          You are being logged out...
        </Typography>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
