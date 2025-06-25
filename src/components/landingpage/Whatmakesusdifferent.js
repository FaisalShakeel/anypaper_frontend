import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

// Import the images
import HowItWorksImage1 from "./howitworksimage1.png";
import HowItWorksImage2 from "./howitworksimage2.png";
import HowItWorksImage3 from "./howitworksimage3.png";
import HowItWorksImage4 from "./howitworksimage4.png";

// Updated features array with image references
const features = [
  {
    title: "100% Human-Written, AI-Free Essays + Turnitin Reports",
    description:
      "Every paper is written by real experts, not AI. We guarantee original work and provide Turnitin reports on demand to prove it.",
    image: HowItWorksImage1,
  },
  {
    title: "Expert Writers with Verified Credentials",
    description:
      "Our writers are carefully selected professionals with proven expertise in their fields, ensuring top-quality academic work.",
    image: HowItWorksImage2,
  },
  {
    title: "Reliable & Transparent Process",
    description:
      "You always know your order status. Revisions & edits available to ensure satisfaction. No hidden fees or surprises—just quality work.",
    image: HowItWorksImage3,
  },
  {
    title: "Trusted by Students Worldwide",
    description:
      "Join thousands of satisfied students who rely on our services for consistent, high-quality academic support they can trust.",
    image: HowItWorksImage4,
  },
];

export default function WhatMakesUsDifferent() {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        px: "2vw",
      }}
    >
      <Box
        sx={{
          maxWidth: "700px",
          mx: "auto",
          mb: 5,
         // background: "linear-gradient(to bottom, #F0F4FA 0%, #F8FAFD 100%)",
          borderRadius: "16px",
          py: 3,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#0B3953",
            mb: 2,
            fontFamily: "raleway, sans-serif",
          }}
        >
          What Makes Us Different
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#2E4A5A",
            fontFamily: "Inter, sans-serif",
          
            fontSize: { xs: "11px", md: "13px" },
            fontStyle: "italic",
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          Innovative Solutions, Personalized Approach: Experience the Power of
          Tailored Expertise
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={10} sm={8} md={6} lg={3} key={index}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  p: 1,
                  textAlign: "left",
                  height: "320px",
                  width: "274px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  mx: "auto",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={feature.image}
                  alt={feature.title}
                  sx={{
                    width: "90%",
                    height: "auto",
                    maxHeight: "160px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    mx: "auto",
                    mt: 1,
                  }}
                />
                <CardContent sx={{ p: 2, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      color: "#0B3953",
                      mb: 1.5,
                      fontSize: "15px",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#455A64",
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}