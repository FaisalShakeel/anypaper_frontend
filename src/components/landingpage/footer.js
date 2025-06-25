import {
  Typography,
  Box,
  Grid,
  useTheme,
  Container,
  Button,
} from "@mui/material";
import { Link } from "react-router";

function Footer() {
  const theme = useTheme(); // Access theme colors

  // Common text style for FAQs and ANY PAPER text
  const commonTextStyle = {
    color: "#6b6b6b",
    textDecoration: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
  };

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 5,
        backgroundColor: "#D2E6E4",
        pt: 4,
        pb: 2,
        px: { xs: 2, sm: 4, md: 10 },
      }}
    >
      <Container>
        <Grid container spacing={0}>
          {/* Left Section - Logo, Text, Email Subscription */}
          <Grid item xs={12} md={12} lg={7}>
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                component="img"
                src={require("./3.png")}
                height={60}
                width={60}
                alt="Logo"
              />
              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  color: "#0B3953",
                  fontSize: { xs: "20px", sm: "22px", md: "24px", lg: "18px" }, // Increased on xs, sm, md
                }}
              >
                ANY PAPER
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                ...commonTextStyle,
                ml: 1,
                mb: 0.5,
              }}
            >
              Please use our service if you are:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ...commonTextStyle,
                ml: 2,
              }}
            >
              - Seeking unique insights into a subject matter for research.
              <br />- Looking to expand your knowledge on a topic.<br />-
              Needing assistance with formatting citations.<br />- Requiring
              help with paraphrasing and managing plagiarism<br />-
              Interested in proofreading based on educational guidelines.
              <br />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ...commonTextStyle,
                ml: 1,
                mt: 0.5,
              }}
            >
              All of the papers at AnyPaper are meant for research purposes only
              and should not be submitted for academic credit.
            </Typography>

            {/* Email Subscription */}
            <Box sx={{ mt: 2, ml: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "2px",
                  overflow: "hidden",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                  width: { xs: "95%", sm: "85%", md: "75%", lg: "50%" }, // Increased width for xs, sm, md
                  backgroundColor: "#fff",
                }}
              >
                <input
                  type="text"
                  placeholder="Your Email"
                  aria-label="Email subscription input"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "0px",
                    fontSize: { xs: "10.5px", sm: "11px", md: "12px" },
                    fontFamily: "'Inter', sans-serif",
                    height: "48px", // Increased height
                    textIndent: "8px", // Adjusted for better spacing
                  }}
                />
                <Button
                  sx={{
                    backgroundColor: "#FFB300",
                    borderRadius: "0",
                    padding: "0",
                    minWidth: { xs: "35%", sm: "35%", md: "35%", lg: "28%" }, // Increased width for xs, sm, md
                    height: "48px", // Increased height, matches input
                    "&:hover": {
                      backgroundColor: "#FFA000",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textTransform: "none",
                      color: "#ffff",
                      px: 2,
                      py: 0.5,
                      fontSize: { xs: "10.5px", sm: "11px", md: "12px" },
                    }}
                  >
                    Subscribe
                  </Typography>
                </Button>
              </Box>
            </Box>

            {/* FAQs & Policies Section (Only on xs, sm, md) */}
            <Box
              sx={{
                mt: 2,
                display: { xs: "flex", lg: "none" }, // Hidden on lg, centered on xs, sm, md
                justifyContent: "center", // Center horizontally
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "center", // Center heading
                  }}
                >
                  FAQs & Policies
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {[
                    "Code of Conduct",
                    "Refund Policy",
                    "Terms & Conditions",
                    "Privacy Policy",
                  ].map((item) => (
                    <Typography
                      key={item}
                      component={Link}
                      to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                      sx={{
                        ...commonTextStyle,
                        display: "block",
                        "&:hover": { textDecoration: "underline" },
                        mb: 1,
                        textAlign: "center", // Center links
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Section - FAQs & Policies (Only on lg) */}
          <Grid
            item
            xs={0}
            lg={5}
            sx={{ display: { xs: "none", lg: "block" } }} // Visible only on lg
          >
            <Box
              sx={{
                mt: 4,
                ml: { xs: 2, lg: 0 },
                display: "flex",
                justifyContent: "flex-end", // Align to very right
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "right", // Right-align heading
                  }}
                >
                  FAQs & Policies
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  {[
                    "Code of Conduct",
                    "Refund Policy",
                    "Terms & Conditions",
                    "Privacy Policy",
                  ].map((item) => (
                    <Typography
                      key={item}
                      component={Link}
                      to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                      sx={{
                        ...commonTextStyle,
                        display: "block",
                        "&:hover": { textDecoration: "underline" },
                        mb: 1,
                        textAlign: "right", // Right-align links
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Typography
          sx={{
            display: "flex",
            color: "#2D2E2E",
            textDecoration: "none",
            fontSize: { xs: "10px", sm: "12px", md: "14px" },
            justifySelf: "center",
            alignSelf: "center",
            fontFamily: "'Raleway', sans-serif",
            mt: 2,
          }}
        >
          © 2025 AnyPaper. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;