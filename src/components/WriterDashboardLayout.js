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
  Divider,
  Button,
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
import axios from "axios";
import { InsertDriveFileOutlined, Logout } from "@mui/icons-material";
import LogoutModal from "./LogoutModel";
import { AuthContext } from "../contexts/AuthContext";

const drawerWidth = 240;
const collapsedWidth = 70;

const WriterDashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutModel, setOpenLogoutModel] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Determine selected option based on current route
  const getSelectedOption = () => {
    const path = location.pathname;
    if (path.includes("/writer/dashboard")) return "Dashboard";
    if (path.includes("/writer/my-orders")) return "My Orders";
    if (path.includes("/writer/chat")) return "Chat";
    if (path.includes("/writer/bid-orders")) return "Bid Orders";
    if (path.includes("/writer/payment-history")) return "Payments";
    if (path.includes("/writer/my-profile")) return "My Profile";
    if (path.includes("writer/my-files")) return "My Files";
    return "Dashboard"; // Default
  };

  const [selectedOption, setSelectedOption] = useState(getSelectedOption());

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleCloseLogoutModel = () => {
    setOpenLogoutModel(false);
  };

  const handleMenuItemClick = (text) => {
    setSelectedOption(text);
    switch (text) {
      case "My Orders":
        navigate("/writer/my-orders");
        break;
      case "Chat":
        navigate("/writer/chat");
        break;
      case "Dashboard":
        navigate("/writer/dashboard");
        break;
      case "Bid Orders":
        navigate("/writer/bid-orders");
        break;
      case "Payments":
        navigate("/writer/payment-history");
        break;
      case "My Profile":
        navigate("/writer/my-profile");
        break;
      case "My Files":
        navigate("/writer/my-files");
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    setOpenLogoutModel(true); // Show modal
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`, {}, { withCredentials: true });

      // Simulate delay before closing the modal (for a better UX)
      setTimeout(() => {
        setOpenLogoutModel(false);
        window.location.href = "/"; // Redirect after logout
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
          { text: "Bid Orders", icon: <GavelIcon /> },
          { text: "My Orders", icon: <ShoppingCartIcon /> },
          { text: "Chat", icon: <ChatIcon /> },
          { text: "My Profile", icon: <PersonIcon /> },
          { text: "Payments", icon: <PaymentIcon /> },
          { text: "My Files", icon: <InsertDriveFileOutlined /> },
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
      {sidebarExpanded ? (
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
      ) : (
        <IconButton
          onClick={handleLogout}
          sx={{
            color: "#fff",
            display: "flex",
            margin: "0 auto",
            mt: 5,
          }}
        >
          <Logout />
        </IconButton>
      )}
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
          <Typography>Hello! {user ? user.name : "Writer"}</Typography>
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
    </Box>
  );
};

export default WriterDashboardLayout;