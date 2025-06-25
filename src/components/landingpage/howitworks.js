import { Box, Typography, Grid, Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const steps = [
  {
    title: "Fill Out The Form",
    description:
      "Fill in the form with accurate details to get started. Our form is simple and easy to complete.",
  },
  {
    title: "Connect With Writer",
    description:
      "Our team of writers will connect with you for further details. We’ll assign the best writer for your needs.",
  },
  {
    title: "Discuss Your Needs",
    description:
      "Discuss the paper requirements with the assigned writer, including your goals and preferences.",
  },
  {
    title: "Get The Paper",
    description:
      "Once the work is done, get the final paper delivered to you on time and as per your expectations.",
  },
];

export default function HowItWorks() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const handleOrderNow = () => {
    if (!user) {
      setSnackbar({ open: true, message: "Please Login", severity: "error" });
    } else if (user.role === "Student") {
      navigate("/student/post-neworder");
    } else {
      setSnackbar({ open: true, message: "Only Student Can Post Order", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        position: "relative",
        background: "transparent",
        minHeight: "100vh", // Ensure it takes full height
        // Page-wide shadow with #E76F51 color
        boxShadow: "0 0 80px 40px #E0F2F1",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle, #E0F2F1 0%, #E0F2F1)",
          zIndex: -1,
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#0B3953",
          mb: 2,
          fontFamily: "raleway, sans-serif",
        }}
      >
        How it works?
      </Typography>
      <Typography
        sx={{
          color: "#0B3953",
          mb: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Learn how our process works in a few simple steps to get started with
        ease and efficiency.
      </Typography>

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          position: "relative",
          background: "transparent",
          boxShadow: "0 0 40px 20px #E0F2F1",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle, #E0F2F1 0%, transparent 70%)",
            zIndex: -1,
          },
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{
                backgroundColor: "#E0F2F1",
                borderRadius: "1px",
              }}
            >
              <Box sx={{ px: 3, py: 4 }}>
                <Box
                  component="img"
                  src={require("./howitworks.png")}
                  alt="Step Image"
                  sx={{
                    width: "5rem",
                    borderRadius: "8px",
                    mb: 2,
                    // Apply light teal tint for 2nd and 4th steps (index 1 and 3)
                    ...(index === 1 || index === 3
                      ? {
                          filter: "opacity(0.5) sepia(1) hue-rotate(140deg) saturate(2)", // Light teal tint
                        }
                      : {}),
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: "#000000",
                    fontFamily: "Inter, sans-serif",
                    mb: 1,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    color: "#999999",
                    fontWeight: 400,
                    fontFamily: "raleway, sans-serif",
                    maxWidth: "70%",
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button
        onClick={handleOrderNow}
        sx={{
          mt: 4,
          backgroundColor: "#FFFFFF", // Light teal background
          color: "#FCA703",
          fontWeight: "bold",
          fontFamily: "raleway, sans-serif",
          borderRadius: "8px",
          textTransform: "none",
          px: 4,
          py: 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Shadow for visibility
          cursor: "pointer", // Add pointer cursor
        }}
      >
        Order Now!
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}