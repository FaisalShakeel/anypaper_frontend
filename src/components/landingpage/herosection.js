import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Container,
  useTheme,
  Avatar,
  AvatarGroup,
  Rating,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from '@mui/system';
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../../contexts/AuthContext";
import Cookies from 'js-cookie'
import { useContext, useEffect, useState } from "react";
import BackgroundImage from "./HeroImage2.png";
import OverlayImage from "./CalculatorIcon.png";
import { useOrderContext } from "../../contexts/OrderContext";
import { StudentPriceCalculationContext } from "../../contexts/StudentPriceCalculationContext";
import { WriterPriceCalculationContext } from "../../contexts/WriterPriceCalculationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { fieldsOfStudy } from "../../constants/FieldsOfStudy";

const navLinks = [{ label: "Become a Writer", path: "/writer/create-account" }];

const actionButtons = [
  { label: "Submit Subject", color: "#F4A261", textColor: "#000" },
];

function HeroSection() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
      '&:after': {
        display: 'none',
      },
    },
  });

  const handleLoginClick = () => {
    setDrawerOpen(false);
    navigate("/login");
  };

  const handleAvatarClick = () => {
    if (user) {
      setDrawerOpen(false);
      setTimeout(() => {
        switch (user.role) {
          case "Student":
            navigate("/student/dashboard");
            break;
          case "Editor":
            navigate("/editor/dashboard");
            break;
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Writer":
            navigate("/writer/dashboard");
            break;
          default:
            navigate("/profile");
        }
      }, 300);
    }
  };

  const handleNavLinkClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const { fieldOfStudy, setFieldOfStudy, typeOfPaper, setTypeOfPaper, quantity, setQuantity, academicLevel, setAcademicLevel, deadline, setDeadline, studentPrice, setStudentPrice, setWriterPrice } = useOrderContext();
  const { getPrice, adjustPriceByType, getClosestDeadline } = useContext(StudentPriceCalculationContext);
  const { getPriceForWriter, adjustPriceByTypeForWriter } = useContext(WriterPriceCalculationContext);
 const location = useLocation()
    
    const [isLoggedIn ,setIsLoggedIn] = useState(false)
  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  })();

  const typesOfPapers = ["Essay", "Report", "Term Paper", "Assesment", "Assignment", "Article Review", "Business Plan", "Calculations", "Coursework", "Case Study", "Lab Work", "Summary", "Cover Letter Writing", "Discussion Post", "Disertation", "Editing", "Formatting", "Lab Report", "Movie Review", "Personal Statement", "Multiple Choice Questions", "Research Proposal", "Resume Writing", "Topic Suggestion", "Thesis", "Rewriting", "Scholarship Essay", "Statistics Project", "Thesis Proposal", "Speech", "Research Paper"].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
   
    const closedDeadline = getClosestDeadline(deadline);
    const calculatedPriceForStudent = getPrice(academicLevel, closedDeadline);
    const finalPriceForStudent = adjustPriceByType(calculatedPriceForStudent, typeOfPaper, closedDeadline);
    const calculatedPriceForWriter = getPriceForWriter(academicLevel, closedDeadline);
    const finalPriceForWriter = adjustPriceByTypeForWriter(calculatedPriceForWriter, typeOfPaper, closedDeadline);
    setStudentPrice(finalPriceForStudent * quantity);
    setWriterPrice(finalPriceForWriter * quantity);
    console.log("Writer Price", calculatedPriceForWriter);
    console.log("final price for writer", finalPriceForWriter);
    console.log("Closed Deadline", closedDeadline);
    console.log("Final Price", finalPriceForStudent);
    console.log("Calculated Price", calculatedPriceForStudent);
  }, [deadline, typeOfPaper, academicLevel, fieldOfStudy, quantity]);

  const handleQuantityChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === "") {
      setQuantity("");
      return;
    }
    const value = Number(rawValue);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    }
  };
  useEffect(()=>{
    const token = Cookies.get("auth_token")
    if(token){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  },[location.pathname])

  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: { xs: "1000%", sm: "1000%", md: "cover", xl: "100%" },
        backgroundPosition: { xs: "center", sm: "center", md: "center", xl: "auto" },
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 2, md: 8 },
          py: 0.6,
          mb: 2,
          pt: 2,
          height: "80px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { navigate("/"); }}>
          <Box
            component="img"
            src={require("./3.png")}
            alt="Any Paper"
            sx={{ width: 60, height: 60, borderRadius: 2 }}
          />
          <Typography sx={{ fontWeight: 540, mt: 0.6, ml: -0.5, fontSize: 16, color: "#0B3953" }}>
            ANY PAPER
          </Typography>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {actionButtons.map((button) => (
            <Button
              onClick={() => {
                navigate("/student/post-neworder");
              }}
              key={button.label}
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#FCA703",
                width: "150px",
                mt: 0.7,
                height: "40px",
                borderRadius: "4px",
                px: 0.1,
                py: 0.5,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 500,
                fontSize: 14,
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {button.label}
            </Button>
          ))}

          {user && isLoggedIn ? (
            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ bgcolor: "#01579B", width: 24, height: 24, fontSize: 14 }}>
                {user && isLoggedIn ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              onClick={handleLoginClick}
              sx={{
                color: "#087E8A",
                textTransform: "none",
                textDecoration: "underline",
                fontWeight: 510,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontFamily: "Raleway, sans-serif",
              }}
            >
              <Avatar src={require('./PersonIcon.png')} sx={{ height: 36, width: 36 }} />
              Log In
            </Button>
          )}
        </Box>

        <IconButton
          onClick={toggleDrawer}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            {actionButtons.map((button) => (
              <ListItem
                button
                key={button.label}
                sx={{ cursor: "pointer" }}
              >
                <Button
                  onClick={() => {
                    navigate('/student/post-neworder');
                  }}
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#FFFFFF",
                    color: "#FCA703",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.5,
                    boxShadow: "none",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 18,
                    fontFamily: "Raleway, sans-serif",
                    "&:hover": {
                      backgroundColor: "#E76F51",
                      color: "#fff",
                    },
                  }}
                >
                  {button.label}
                </Button>
              </ListItem>
            ))}
            <ListItem sx={{ cursor: "pointer" }}>
              {user ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  onClick={handleAvatarClick}
                >
                  <Avatar sx={{ bgcolor: "#01579B", width: 28, height: 28, fontSize: 14 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Typography>{user.name || "User"}</Typography>
                </Box>
              ) : (
                <Button
                  fullWidth
                  onClick={handleLoginClick}
                  sx={{
                    color: "#087E8A",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontFamily: "Raleway, sans-serif",
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 20 }} />
                  Login
                </Button>
              )}
            </ListItem>
          </List>
        </Drawer>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 2, md: 6 },
          pb: { xs: 2, md: 12 },
          overflow: "hidden",
          zIndex: 1,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "90%",
            height: "15%",
            background: "white",
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
            transform: "scaleX(1.3)",
            transformOrigin: "bottom center",
            zIndex: 2,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            mt: { xs: "", sm: "", md: "" },
            zIndex: 3,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              sm={11}
              md={7}
              sx={{
                textAlign: { xs: "center", md: "left" },
                mb: { xs: 3, md: 0 },
                pt: { xs: 0, md: 0 },
                padding: "none",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#E6F0EE",
                  display: "inline-block",
                  px: 3,
                  py: 1,
                  borderRadius: "6px",
                  fontWeight: 500,
                  fontFamily: "Inter,sans-serif",
                  color: "#252641",
                  fontSize: { xs: "13px", md: "18px" },
                  mb: 1,
                  mt: { xs: 0, md: 3 },
                }}
              >
                Written By Experts{" "}
                <Box component="span" sx={{ fontWeight: 800 }}>
                  No AI
                </Box>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: "#0B7077",
                  lineHeight: 1.2,
                  fontFamily: "raleway,sans-serif",
                  fontSize: { xs: "1.6rem", sm: "1.6rem", md: "3.4rem" },
                  fontWeight: 650,
                  mb: 2.5,
                }}
              >
                Say Good Bye To Stress: <br />
                <span
                  style={{
                    display: "block",
                    fontSize: { xs: "30px", sm: "30px", md: "3.4rem" },
                    lineHeight: 1.2,
                    fontFamily: "raleway, sans-serif",
                    fontWeight: 650,
                  }}
                >
                  Hire An Expert Essay Writer!
                </span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  fontFamily: "Inter,sans-serif",
                  color: "#252641",
                  fontWeight: 500,
                  fontSize: { xs: "11px", sm: "13px", md: "17px" },
                  maxWidth: { xs: "90%", sm: "90%", md: "70%" },
                  mx: { xs: "auto", md: 0 },
                  lineHeight: 1.2,
                }}
              >
                Rely on trusted professionals for{" "}
                <span style={{ color: "#FCA703", fontWeight: "bold" }}>
                  human-written
                </span>{" "}
                essays that{" "}
                <span style={{ color: "#FCA703", fontWeight: "bold" }}>
                  meet deadlines
                </span>{" "}
                and exceed expectations.
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  pb: 2,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: { xs: 2, md: 3 },
                }}
              >
                <Button
                  onClick={() => {
                    navigate("/student/placeorder/step/1");
                  }}
                  variant="contained"
                  sx={{
                    textTransform: "None",
                    boxShadow: "None",
                    backgroundColor: "#FCA703",
                    color: "white",
                    fontWeight: 500,
                    px: { xs: 2.5, md: 6 },
                    py: { xs: 1, md: 1 },
                    borderRadius: "4px",
                    fontSize: { xs: "13px", md: "15px" },
                    "&:hover": { backgroundColor: "#e69500" },
                  }}
                >
                  Hire Now!
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transform: "scale(1)",
                  }}
                >
                  <img src={require('./AvatarGroup.png')} />
                  <Box>
                    <Rating
                      value={5}
                      readOnly
                      size="small"
                      sx={{ color: "#FCA703" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4A4A4A",
                        fontSize: { xs: "12px", md: "13px" },
                        fontWeight: "bold",
                      }}
                    >
                      (10k+ Reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={10}
              md={5}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 0, md: 0 },
                pt: 0,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  pt: 5,
                  mt: 0,
                  pb: 2,
                  mx: "auto",
                  borderRadius: "12px",
                  backgroundColor: "rgba(4, 106, 108, 0.44)",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  width: "100%",
                  maxWidth: { xs: "300px", sm: "300px", md: "340px" },
                  height: { xs: "auto", md: "360px" },
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 6,
                }}
              >
                <Box sx={{ mb: { xs: 1.5, md: 1 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      mb: 0.25,
                      fontSize: { xs: "13px", md: "13px" },
                    }}
                  >
                    Type of Paper
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={typeOfPaper}
                    onChange={(e) => setTypeOfPaper(e.target.value)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiSelect-icon": { color: "white" },
                      "& .MuiInputBase-input": {
                        py: 1.5,
                        fontSize: { xs: "16px", md: "16px" },
                      },
                    }}
                  >
                    {typesOfPapers.map((typeOfPaper) => (
                      <MenuItem value={typeOfPaper}>{typeOfPaper}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ mb: { xs: 1.5, md: 1 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      mb: 0.25,
                      fontSize: { xs: "13px", md: "13px" },
                    }}
                  >
                    Field of Study
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiSelect-icon": { color: "white" },
                      "& .MuiInputBase-input": {
                        py: 1.5,
                        fontSize: { xs: "16px", md: "16px" },
                      },
                    }}
                  >
                    {fieldsOfStudy.map((fieldOfStudy) => (
                      <MenuItem value={fieldOfStudy}>{fieldOfStudy}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: { xs: 1.5, md: 1 } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 500,
                        mb: 0.25,
                        fontSize: { xs: "13px", md: "13px" },
                      }}
                    >
                      Academic Level
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "white" },
                          "&.Mui-focused fieldset": { borderColor: "white" },
                        },
                        "& .MuiSelect-icon": { color: "white" },
                        "& .MuiInputBase-input": {
                          py: 1.5,
                          fontSize: { xs: "16px", md: "16px" },
                        },
                      }}
                    >
                      <MenuItem value="HighSchool">High School</MenuItem>
                      <MenuItem value="College">College</MenuItem>
                      <MenuItem value="Bachelor">Bachelors</MenuItem>
                      <MenuItem value="Masters">Masters</MenuItem>
                      <MenuItem value="Phd">Phd</MenuItem>
                    </TextField>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 500,
                        mb: 0.25,
                        fontSize: { xs: "13px", md: "13px" },
                      }}
                    >
                      No of Pages
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      value={quantity}
                      onBlur={handleBlur}
                      onChange={handleQuantityChange}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "white" },
                          "&.Mui-focused fieldset": { borderColor: "white" },
                        },
                        "& .MuiInputBase-input": {
                          py: 1.5,
                          fontSize: { xs: "16px", md: "16px" },
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: { xs: 1.5, md: 1 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      mb: 0.25,
                      fontSize: { xs: "13px", md: "13px" },
                    }}
                  >
                    Deadline
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputProps={{ inputProps: { min: today } }}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        color: "white !important",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputBase-input": {
                        py: 1.5,
                        fontSize: { xs: "16px", md: "16px" },
                      },
                      '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    padding: "0",
                    borderRadius: "4px",
                    height: "45px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: "white",
                      fontSize: { xs: "22px", md: "22px" },
                      pl: 1,
                      py: 1.5,
                    }}
                  >
                    ${studentPrice.toFixed(2)}
                  </Typography>
                  <Button
                    onClick={() => {
                      navigate("/student/placeorder/step/1");
                    }}
                    variant="contained"
                    sx={{
                      backgroundColor: "white",
                      textTransform: "none",
                      color: "#FCA703",
                      fontWeight: 500,
                      fontFamily: "raleway,sans-serif",
                      padding: 0,
                      margin: 0,
                      borderRadius: "0 4px 4px 0",
                      height: "100%",
                      minWidth: "160px",
                      fontSize: { xs: "16px", md: "16px" },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  >
                    Proceed to order
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Box
              sx={{
                position: 'absolute',
                left: '98%',
                top: '99%',
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${OverlayImage})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '90px',
                height: '90px',
                zIndex: 0,
                display: { xs: "none", lg: "block" }
              }}
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HeroSection;