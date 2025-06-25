import { Box, CircularProgress } from "@mui/material";

function CircularProgressLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        bgcolor: "white",
      }}
    >
      <CircularProgress
        sx={{
          color: "#ff9800", // Orange spinner
        }}
        size={40}
        thickness={5}
      />
    </Box>
  );
}

export default CircularProgressLoading;