import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

const guarantees = [
  {
    title: "100% Original & Human-Written Content",
    description:
      "Every paper is written from scratch, supported by credible academic sources, and includes a free Turnitin report for your peace of mind. Expert writers deliver content tailored to your needs.",
  },
  {
    title: "Complete Confidentiality",
    description:
      "Hire a writer with full confidence that your personal and academic information stays safe. At AnyPaper Pro, we prioritize your privacy with a strict confidentiality policy and secure data-handling practices.",
  },
  {
    title: "Unlimited Free Edits",
    description:
      "Enjoy up to 30 days of free, unlimited revisions on your paper. 14 days for assignments up to 20 pages and 30 days for longer ones. Your dedicated expert will ensure all instructor feedback is seamlessly incorporated, ensuring your paper meets every requirement.",
  },
  {
    title: "On-Time Delivery",
    description:
      "We ensure timely delivery for every order, giving you the time that you need to review and request any changes. For larger projects, we offer drafts along the way to ensure we're on track. With your money-back guarantee, your satisfaction is our priority.",
  },
];

export default function WhatWeGuarantee() {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        position: "relative",
        minHeight: "100vh",
        // More visible background color
        backgroundColor: "#E0F2F1",
        // Adding a light gradient overlay
        background: 'linear-gradient(to bottom, #E0F2F1, #E0F2F1)',
        // Add more depth with a radial gradient
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, #E0F2F1 30%, #d3ebe9 100%)",
          zIndex: -1,
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#0B3953",
          mb: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        WHAT WE GUARANTEE
      </Typography>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          position: "relative",
          background: "#E0F2F1",
          padding: 4,
          borderRadius: "12px",
          // Add a subtle shadow for depth
          boxShadow: "0 0 20px rgba(224, 242, 241, 0.8)",
          zIndex: 1,
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {guarantees.map((item, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <Card
                sx={{
                  backgroundColor: "#E0F2F1",
                  borderRadius: "12px",
                  // Add a border to make cards stand out from background
                  border: "1px solid rgba(11, 57, 83, 0.1)",
                  // Add depth with shadow
                  boxShadow: "0 4px 12px rgba(11, 57, 83, 0.07)",
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: "0 8px 16px rgba(11, 57, 83, 0.1)",
                  },
                  p: { xs: 0, md: 2, lg: 3 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "secondary.main",
                      mb: 2,
                      textAlign: "start",
                      fontSize: { xs: "16px", md: "18px" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component="img"
                      src={require("./whatwegurantee.png")}
                      alt="Guarantee Icon"
                      sx={{
                        width: { xs: "4rem", md: "8rem" },
                        borderRadius: "10px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "secondary.main",
                        textAlign: "start",
                        fontSize: { xs: "11px", md: "15px" },
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}