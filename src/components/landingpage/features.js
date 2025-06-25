import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import BackgroundImage from "./Group1000002608.png";
import React, { useEffect } from "react";
import HowItWorksImage1 from "./howitworksimage1.png";
import HowItWorksImage2 from "./howitworksimage2.png";
import HowItWorksImage3 from "./howitworksimage3.png";
import HowItWorksImage4 from "./howitworksimage4.png";
import { useNavigate } from "react-router-dom";

function Features() {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Navigate function available:", navigate !== undefined);
  }, [navigate]);
  
  const handleOrderNowClick = () => {
    navigate("/student/placeorder/step/1");
  };
  
  const cards = [
    {
      icon: "1.png",
      title: "100% Original & Human-Written Content",
      description:
        "Every paper is written from scratch, supported by credible academic sources, and includes a free Turnitin report for your peace of mind. Expert writers deliver content tailored to your needs.",
    },
    {
      icon: "lockIcon.png",
      title: "Complete Confidentiality",
      description:
        "Hire a writer with full confidence that your personal and academic information stays safe. At AnyPaper Pro, we prioritize your privacy with a strict confidentiality policy and secure data-handling practices.",
    },
    {
      icon: "4.png",
      title: "Unlimited Free Edits",
      description:
        "Enjoy up to 30 days free, unlimited revisions on your paper — 14 days for assignments up to 20 pages and 30 days for longer ones. Your dedicated expert will ensure all instructor feedback is seamlessly incorporated, ensuring your paper meets every requirement.",
    },
    {
      icon: "2.png",
      title: "On-Time Delivery",
      description:
        "We ensure timely delivery for every order, giving you the time that you need to review and request any changes. For larger projects, we offer drafts along the way to ensure we're on track. With your money-back guarantee, your satisfaction is our priority.",
    },
  ];
  const steps = [
    {
      title: "Fill Out The Form",
      description:
        "Fill in the form with accurate details to get started. Our form is simple and easy to complete.",
    },
    {
      title: "Connect With Writer",
      description:
        "Our team of writers will connect with you for further details. We'll assign the best writer for your needs.",
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

  return (
    <Box
      sx={{
        position: "relative",
        background: `radial-gradient(circle at 50% 70%, #D8EEEA 0%, white 80%)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        "&:before": {
          content: '""',
          position: "absolute",
          top: "40%",
          left: "10%",
          width: "90%",
          height: "240vh",
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          mt: 8,
          py: 2,
          pb: 0,
          px: { xs: 4, sm: 8, md: 16 },
          textAlign: "center",
          position: "relative",
          minHeight: "fit-content",
          fontFamily: "'Inter', sans-serif",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 4,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            mb: 2,
            fontFamily: "raleway,sans-serif",
            color: "#0B3953",
            position: "relative",
            fontSize: { xs: "20px", sm: "24px", md: "40px" },
            zIndex: 4,
          }}
        >
          WHAT WE GUARANTEE
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: "100%",
            maxWidth: { xs: "100%", sm: "100%", md: "1200px" },
            mx: "auto",
            position: "relative",
            zIndex: 4,
            padding: { xs: 0, sm: 0, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr",
              },
              rowGap: { xs: 4, sm: 4, md: 8, lg: 8 },
              columnGap: { xs: 4, sm: 4, md: 8, lg: 8 },
              width: { xs: "100%", sm: "min(100%, 600px)", md: "100%" },
              maxWidth: { xs: "340px", sm: "600px", md: "none" },
              mx: "auto",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            {cards.map((card, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#D8E9E8",
                  borderRadius: "12px",
                  p: { xs: 2, sm: 2 },
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                  width: { xs: "100%", sm: "100%" },
                  maxWidth: { xs: "340px", sm: "600px", md: "none" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "16px", sm: "1.1rem" },
                    color: "#000",
                    alignSelf: "start",
                    mb: 2,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "flex-start" },
                    gap: { xs: 1, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: { xs: "35px", sm: "60px" },
                      height: { xs: "40px", sm: "60px" },
                    }}
                  >
                    <img
                      src={require(`./${card.icon}`)}
                      alt="Icon"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: { xs: "14px", sm: "14px" },
                      color: "#0D0D0D",
                      lineHeight: "1.2",
                      flex: 1,
                      pr: 2,
                      textAlign: { xs: "left", sm: "left" },
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          pt: 4,
          pb: 8,
          textAlign: "center",
          position: "relative",
          minHeight: "fit-content",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "Bold",
            color: "#0B3953",
            mb: 2,
            fontFamily: "Raleway, sans-serif",
            fontSize: { xs: "18px", sm: "22px", md: "35px", lg: "40px" },
          }}
        >
          How it works?
        </Typography>
        <Typography
          sx={{
            color: "#0B3953",
            mb: 4,
            fontFamily: "Inter, sans-serif",
            px: { md: 8, xs: 4 },
            fontSize: { xs: "12px", sm: "16px", md: "18px" },
          }}
        >
          Learn how our process works in a few simple steps to get started with
          ease and efficiency.
        </Typography>

        <Box
          sx={{
            maxWidth: { lg: "90%" },
            px: { xs: 8, md: 4 },
            position: "relative",
            justifySelf: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid container spacing={0} justifyContent="center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={2}
                  sx={{
                    borderRadius: "1px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      px: 0,
                      py: 4,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: index % 2 !== 0 ? "#BBDADD" : "#0B7077",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "16px",
                        justifySelf: "center",
                        mb: 4,
                      }}
                    >
                      <Box
                        component="img"
                        src={require(`./step${index + 1}.png`)}
                        alt="Icon"
                        style={{
                          width: "50%",
                          height: "50%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#000000",
                        fontFamily: "Inter, sans-serif",
                        fontSize: { xs: "16px", lg: "18px" },
                        mb: 1,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#000",
                        fontWeight: 400,
                        fontFamily: "inter, sans-serif",
                        minWidth: "110%",
                        fontSize: { xs: "14px", lg: "15px" },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
                {index < steps.length - 1 && (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={1.2}
                    sx={{
                      display: { sm: "none", xs: "none", md: "block" },
                      textAlign: "center",
                      p: 0,
                      mb: 18,
                      alignSelf: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={require("./Frame1000006138.png")}
                      alt="Separator"
                      sx={{
                        maxWidth: "66%",
                        height: "auto",
                        alignSelf: "center",
                      }}
                    />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        <Button
          onClick={handleOrderNowClick}
          data-testid="order-now-button"
          sx={{
            mt: 4,
            backgroundColor: "#FFFFFF",
            color: "#FCA703",
            fontWeight: "bold",
            fontFamily: "raleway, sans-serif",
            borderRadius: "4px",
            textTransform: "none",
            px: 4,
            py: 1,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 10,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#F8F8F8",
            },
          }}
        >
          Order Now!
        </Button>
      </Box>
      <Box
        sx={{
          position: "relative",
          py: 0,
          pb: 8,
          textAlign: "center",
          px: "2vw",
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            mb: 5,
            borderRadius: "16px",
            py: 0,
            px: 2,
            zIndex: 5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#35332F",
              mb: 2,
              fontFamily: "raleway, sans-serif",
              zIndex: 5,
              fontSize: { xs: "18px", sm: "35px" },
            }}
          >
            What Makes Us Different
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#252641",
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: "12px", sm: "16px", lg: "18px" },
              maxWidth: "900px",
              mx: "auto",
              zIndex: 5,
            }}
          >
            Innovative Solutions, Personalized Approach: Experience the Power of
            Tailored Expertise
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: "1280px",
            mx: "auto",
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid 
                item 
                xs={10} 
                sm={8} 
                md={6} 
                lg={3} 
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  px: { lg: 2 },
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#FFFFFF",
                    zIndex: 10,
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                    p: 1,
                    textAlign: "left",
                    height: { xs: "300px", lg: "340px" },
                    width: { xs: "274px", lg: "300px" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
                      borderRadius: "6px",
                      mx: "auto",
                      mt: 1,
                      zIndex: 5,
                    }}
                  />
                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        color: "#1B1139",
                        mb: 1.5,
                        fontSize: { xs: "16px", lg: "18px" },
                        fontFamily: "Inter, sans-serif",
                        lineHeight: 1.3,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#1B1139",
                        fontSize: { xs: "11px", lg: "13px" },
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
    </Box>
  );
}

export default Features;