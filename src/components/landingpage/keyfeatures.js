import { Box, Typography, Grid, useTheme } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SecurityIcon from "@mui/icons-material/Security";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VerifiedIcon from "@mui/icons-material/Verified";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutorenewIcon from "@mui/icons-material/Autorenew";

function KeyFeatures() {
  const theme = useTheme();

  const features = [
    {
      icon: (
        <StarBorderIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "100% Original Papers",
      description:
        "You’ll receive a completely original paper, crafted from scratch by our professional writers and rigorously checked for plagiarism before delivery.",
    },
    {
      icon: (
        <AccessTimeIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Timely Delivery",
      description:
        "We guarantee on-time delivery for your papers. Our skilled writers can handle urgent requests in as little as 3 hours, ensuring you never miss a deadline.",
    },
    {
      icon: (
        <FavoriteBorderIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Personalized Service",
      description:
        "Our dedicated team of writers will provide you with personalized attention. We always adhere closely to your specific writing guidelines.",
    },
    {
      icon: (
        <VerifiedIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Quality and Expertise",
      description:
        "Your paper will be created by an expert with relevant academic qualifications, ensuring a consistently high quality in every single piece.",
    },
    {
      icon: (
        <AttachMoneyIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Affordable Pricing",
      description:
        "You’ll receive a high-quality, A-worthy paper at competitive prices that other writing services struggle to match. We also offer discounts and special deals.",
    },
    {
      icon: (
        <LoyaltyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Complimentary Features",
      description:
        "With every order, enjoy valuable freebies such as anti-plagiarism checks, formatting services, and up to three revisions at no additional cost.",
    },
    {
      icon: (
        <SecurityIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Complete Confidentiality",
      description:
        "We prioritize your privacy with secure encryption for all communications, safe payment processing, and complete confidentiality of your information.",
    },
    {
      icon: (
        <AutorenewIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Money-Back Guarantee",
      description:
        "If you’re not completely satisfied with your paper, our straightforward refund policy ensures you can get your money back quickly and easily.",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 8 },
        textAlign: "start",
        mx: "2vw",
      }}
    >
      <Grid container spacing={4}>
        {" "}
        {features.map((feature, index) => (
          <Grid item xs={6} md={3} key={index}>
            {" "}
            {/* ✅ Now shows 2 columns on mobile */}
            <Box sx={{ textAlign: "start" }}>
              {/* Feature Icon */}
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>

              {/* Feature Title */}
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                fontSize="20px"
              >
                {feature.title}
              </Typography>

              {/* Underline */}
              <Box
                sx={{
                  width: "50px",
                  height: "2px",
                  backgroundColor: theme.palette.primary.main,
                  my: 2,
                }}
              />

              {/* Feature Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "14px", md: "18px" } }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default KeyFeatures;
