import React, { useContext, useState } from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SubjectIcon from "@mui/icons-material/MenuBook";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { AuthContext } from "../contexts/AuthContext";
import { InsertDriveFileOutlined, Logout } from "@mui/icons-material";
import axios from "axios";
import LogoutModal from "./LogoutModel";
import Cookies from 'js-cookie'
import { useOrderContext } from "../contexts/OrderContext";
import WriterTestimonialModal from "./WriterTestimonialModel";

const drawerWidth = 240;
const collapsedWidth = 70;

const StudentDashboardLayout = ({ children }) => {
  
  
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const{user,setIsLoggedOut,setUser}=useContext(AuthContext)
  const[openLogoutModel,setOpenLogoutModel]=useState(false)
  const [isWriterTestimonialModel, setIsWriterTestimonialModelOpen] = useState(false)

  const closeWriterTestimonialModel = ()=>{
    setIsWriterTestimonialModelOpen(false)
  }
  const openWriterTestimonialModel = ()=>{
    setIsWriterTestimonialModelOpen(true)
  }

  // Determine selected option based on current route
  const getSelectedOption = () => {
    const path = location.pathname;
    if (path.includes("/student/dashboard")) return "Dashboard";
    if (path.includes("/student/myorders")) return "My Orders";
    if (path.includes("/student/chat")) return "Chat";
    if (path.includes("/student/my-writers")) return "My Writers";
    if (path.includes("/student/payment-history")) return "Payments";
    if (path.includes("/student/settings")) return "Settings";
    if(path.includes("/student/my-files")) return "My Files";
    return "";
  };

  const [selectedOption, setSelectedOption] = useState(getSelectedOption());

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleCloseLogoutModel=()=>{
    setOpenLogoutModel(false)
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleMenuItemClick = (text) => {
    setSelectedOption(text);
    switch(text) {
      case "My Orders":
        navigate("/student/myorders");
        break;
      case "Chat":
        navigate("/student/chat");
        break;
      case "Dashboard":
        navigate("/student/dashboard");
        break;
      case "My Writers":
        navigate("/student/my-writers");
        break;
      case "Payments":
        navigate("/student/payment-history");
        break;
      case "Settings":
        navigate("/student/settings");
        break;

      case "My Files":
        navigate("/student/my-files")
        break;  
      default:
        break;
    }
  };
  
  const handleLogout = async () => {
    setOpenLogoutModel(true); // Show modal
    const token= Cookies.get("auth_token")
     console.log("Token In Cookies",token)
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      

    
     

      // Simulate delay before closing the modal (for a better UX)
      setTimeout(() => {
        
        setOpenLogoutModel(false);
        setIsLoggedOut(true)
        setUser(null)
          if (window.history.length > 1) {
      window.history.go(-(window.history.length - 1));
      setTimeout(() => {
        window.history.replaceState(null, '', "/");
        navigate("/", { replace: true });
      }, 100);
    } else {
      navigate("/", { replace: true });
    }
  
      }, 2000);
    } catch (error) {
      console.error("Logout failed", error.response?.data?.message);
      setOpenLogoutModel(false);
    }
  };

  const drawer = (
    <Box
      sx={{
        backgroundColor: "#0b3953",
        color: "#fff",
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#FFA726",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#003366",
        },
      }}
    >
      {/* Top Section: Logo and Toggle Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarExpanded ? "space-between" : "center",
          padding: 2,
          height: 64,
        }}
      >
        {sidebarExpanded && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              onClick={() => navigate("/")}
              component="img"
              src={require('./3.png')}
              alt="Any Paper"
              sx={{ marginRight: 1, height: "50px", width: "50px", borderRadius: "4px", cursor: "pointer" }}
            />
            <Typography 
              onClick={() => navigate("/")} 
              sx={{ fontWeight: "bold", marginTop: "7px", cursor: "pointer" }}
            >
              Any Paper
            </Typography>
          </Box>
        )}
        {/* Toggle button visible only on larger devices */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "#fff",
            cursor: "pointer",
            display: { xs: "none", sm: "none", md: "block" },
          }}
        >
          {sidebarExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider
        sx={{
          backgroundColor: "#ffffff",
          height: "2px",
          marginX: 1.5,
        }}
      />

      {/* Sidebar Options */}
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon /> },
          { text: "My Orders", icon: <SubjectIcon /> },
          { text: "Chat", icon: <ChatIcon /> },
          { text: "My Writers", icon: <SubjectIcon /> },
          { text: "Payments", icon: <PaymentIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
          { text: "My Files", icon:<InsertDriveFileOutlined/>}
        ].map(({ text, icon }) => (
          <ListItem
            button
            key={text}
            onClick={() => handleMenuItemClick(text)}
            sx={{
              color: selectedOption === text ? "#FFA726" : "#fff",
              "&:hover": { color: "#FFA726" },
              cursor: "pointer",
              justifyContent: sidebarExpanded ? "flex-start" : "center",
              paddingX: sidebarExpanded ? 2 : 0,
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedOption === text ? "#FFA726" : "#fff",
                justifyContent: "center",
              }}
            >
              {icon}
            </ListItemIcon>
            {sidebarExpanded && (
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: selectedOption === text ? "bold" : "medium",
                  fontSize: "1rem",
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Divider
        sx={{
          backgroundColor: "#ffffff",
          height: "2px",
          marginX: 1.5,
        }}
      />

      {/* Bottom Section with New Order Button and Testimonial */}
      <Box sx={{ padding: 2 }}>
        {sidebarExpanded ? (
          <>
            <Button
              onClick={() => navigate("/student/post-neworder")}
              fullWidth
              variant="contained"
              startIcon={<PostAddIcon />}
              sx={{
                backgroundColor: "#FFA726",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#FF9800",
                },
                marginBottom: 2,
              }}
            >
              Post New Order
            </Button>
            <Button
            onClick={openWriterTestimonialModel}
              fullWidth
              variant="text"
              startIcon={<RateReviewIcon />}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Submit Testimonial
            </Button>
            <Button
              onClick={handleLogout} 
              sx={{
                margin: "auto",
                mt: 5,
                justifyContent: "center",
                backgroundColor: "orange",
                color: "white",
                "&:hover": {
                  backgroundColor: "#ff9800",
                },
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "bold",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Logout sx={{ fontSize: 20 }} />
              Logout
            </Button>
          </>
        ) : (
          <>
            <IconButton
              onClick={() => navigate("/student/post-neworder")}
              sx={{
                color: "#FFA726",
                display: "flex",
                margin: "0 auto",
                marginBottom: 2,
              }}
            >
              <PostAddIcon />
            </IconButton>
            <IconButton
            onClick={openWriterTestimonialModel}
              sx={{
                color: "#fff",
                display: "flex",
                margin: "0 auto",
              }}
            >
              <RateReviewIcon />
            </IconButton>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#fff",
                display: "flex",
                margin: "0 auto",
                mt: 5
              }}
            >
              <Logout />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {/* Sidebar for smaller screens */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 1300,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer,
          backgroundColor: "#fff",
          color: "#003366",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          width: {
            md: `calc(100% - ${sidebarExpanded ? drawerWidth : collapsedWidth}px)`,
            xs: "100%",
            sm: "100%",
          },
          marginLeft: {
            md: sidebarExpanded ? `${drawerWidth}px` : `${collapsedWidth}px`,
          },
          transition: "margin-left 0.3s, width 0.3s",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "block", sm: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            My Balance: $0
          </Typography>
          <Typography>Hello! {user?user.name:""}</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar for larger screens */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: sidebarExpanded ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            boxSizing: "border-box",
            top: { md: 0 },
            height: { md: "100%" },
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: 8,
          marginLeft: {
            md: sidebarExpanded ? `${drawerWidth}px` : `${collapsedWidth}px`,
          },
          transition: "margin-left 0.3s",
          padding: 1.5,
        }}
      >
        {children}
      </Box>
      <LogoutModal open={openLogoutModel} handleClose={handleCloseLogoutModel} />
      <WriterTestimonialModal open={isWriterTestimonialModel} onClose={closeWriterTestimonialModel}/>
    </Box>
  );
};

export default StudentDashboardLayout;