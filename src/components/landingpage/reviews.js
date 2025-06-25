import { Box, Typography, Avatar, Card, IconButton, Grid } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useState } from "react";
import quote from "./quote.png";

const reviews = [
  {
    avatar: "/path-to-avatar1.jpg",
    name: "Jeff Hagen",
    review:
      "I've been consistently impressed with the quality of service provided by this website. They have exceeded my expectations and delivered exceptional results. Highly recommended!",
  },
  {
    avatar: "/path-to-avatar2.jpg",
    name: "Sophia Carter",
    review:
      "The writers here truly understand academic standards. The paper I received was well-researched, properly formatted, and exceeded my expectations.",
  },
  {
    avatar: "/path-to-avatar3.jpg",
    name: "Michael Lee",
    review:
      "Timely delivery and professional work. The support team was always available for my queries. This service is a game changer!",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 2, sm: 4, md: 8 },
        px: { xs: 2, sm: 4, md: 8 },
        backgroundColor: "rgba(210, 230, 228, 1)",
        zIndex: 5,
      }}
    >
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left Side: Heading and Text */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#0B3953",
              fontFamily: "raleway,sans-serif",
              mb: 1,
              zIndex: 5,
              fontSize: { md: "35px", xs: "24px" },
            }}
          >
            Any Paper Reviews
          </Typography>
          <div style={{ minWidth: { xs: "120%", md: "70%", lg: "50%" } }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
                color: "#000",
                fontWeight: 400,
                fontFamily: "raleway, sans-serif",
                zIndex: 5,
              }}
            >
              Here's what our customers are saying about us. They loved our
              service and the quality of papers!
            </Typography>
          </div>
        </Grid>

        {/* Right Side: Card with Arrows */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              position: "relative",
              maxWidth: { xs: "100%", sm: "100%", md: "600px" }, // Full width on small devices
              display: "flex",
              ml: { md: "40px" },
              mr: { md: "40px" },
              flexDirection: "column",
              alignSelf: { sm: "right", xs: "center" },
              justifySelf: "end",
              zIndex: 5,
            }}
          >
            {/* Card */}
            <Card
              sx={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "row", // Always row, even on smaller devices
                zIndex: 5,
              }}
            >
              {/* Left Side Inside Card: Quotation Icon and Review Text */}
              <Box
                sx={{
                  flex: 1,
                  p: 4,
                  backgroundColor: "#F5F5F5", // Light gray background
                  zIndex: 5,
                }}
              >
                <Box
                  component="img"
                  src={quote}
                  alt={quote}
                  sx={{
                    display: "flex",
                    justifySelf: "center",
                    mb: 2,
                    width: { md: "60px" },
                  }}
                />
                <Typography
                  sx={{
                    color: "#2C2C2C",
                    fontSize: { xs: "14px", md: "18px" },
                    textAlign: "center",
                    lineHeight: "1.2",
                    px: { md: "16px" },
                    zIndex: 5,
                    fontFamily: "inter, sans-serif",
                  }}
                >
                  "{reviews[currentIndex].review}"
                </Typography>
              </Box>

              {/* Right Side Inside Card: Avatar and Name */}
              <Box
                sx={{
                  flex: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                  zIndex: 5,
                }}
              >
                <Avatar
                  src={reviews[currentIndex].avatar}
                  alt={reviews[currentIndex].name}
                  sx={{
                    width: { xs: 80, md: 100 }, // Slightly smaller on xs
                    height: { xs: 80, md: 100 },
                    mb: 2,
                    border: "4px solid white",
                    zIndex: 5,
                  }}
                />
                <Typography
                  fontWeight="bold"
                  variant="h6"
                  textAlign="center"
                  color="#2C2C2C"
                  sx={{ fontSize: { xs: "16px", md: "20px" }, zIndex: 5 }} // Adjust font size for smaller devices
                >
                  {reviews[currentIndex].name}
                </Typography>
              </Box>
            </Card>

            {/* Arrows for Larger Devices (Left and Right) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" }, // Hidden on smaller devices
                alignItems: "center",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "100%",
                justifyContent: "space-between",
                zIndex: 5,
              }}
            >
              <IconButton
                onClick={handlePrev}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  ml: -8, // Adjusted for positioning outside card
                  "&:hover": {
                    backgroundColor: "#FCA703",
                    "& svg": { color: "white" }, // Change arrow color to white on hover
                  },
                  zIndex: 5,
                }}
              >
                <ArrowBack sx={{ color: "#FCA703" }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  mr: -8, // Adjusted for positioning outside card
                  "&:hover": {
                    backgroundColor: "#FCA703",
                    "& svg": { color: "white" }, // Change arrow color to white on hover
                  },
                  zIndex: 5,
                }}
              >
                <ArrowForward sx={{ color: "#FCA703" }} />
              </IconButton>
            </Box>

            {/* Arrows for Smaller Devices (Bottom Center) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" }, // Only visible on smaller devices
                justifyContent: "center",
                mt: 2,
                gap: 2,
                zIndex: 5,
              }}
            >
              <IconButton
                onClick={handlePrev}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#FCA703",
                    "& svg": { color: "white" }, // Change arrow color to white on hover
                  },
                }}
              >
                <KeyboardArrowLeft sx={{ color: "#FCA703" }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#FCA703",
                    "& svg": { color: "white" }, // Change arrow color to white on hover
                  },
                }}
              >
                <KeyboardArrowRight sx={{ color: "#FCA703" }} />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}