import { Box, Typography, Button } from "@mui/material";

function ErrorMessage({ message, onTryAgain }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "white",
        p: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "500px",
          width: "100%",
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          border: "1px solid #ff9800", // Orange border
        }}
      >
        <Typography
          variant="h6"
          color="error"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Error
        </Typography>
        <Typography variant="body1" color="text.primary" gutterBottom>
          {message}
        </Typography>
        <Button
          variant="contained"
          onClick={onTryAgain}
          sx={{
            mt: 2,
            bgcolor: "#ff9800", // Orange background
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#e59400" }, // Darker orange on hover
            px: 4,
            py: 1,
          }}
        >
          Try Again
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorMessage;