import React, { useState } from "react";
import {
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Box,
  Typography,
  ListItemText,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

const navLinks = [{ label: "Become a Writer", path: "/writer/create-account" }];

const actionButtons = [
  { label: "Submit Subject", color: "#F4A261", textColor: "#000" },
];

function NavBar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
        py: 0.6,
        height: "80px",
        backgroundColor: "#D2E5E3",
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex",cursor:"pointer", alignItems: "center" }} onClick={()=>{
        navigate("/")
      }}>
        <Box
          component="img"
          src={require("./3.png")}
          alt="Any Paper"
          sx={{ width: 60, height: 60, borderRadius: 2 }}
        />
        <Typography sx={{fontWeight:540, mt: 0.6, ml:-0.5, fontSize: 16,color:"#0B3953"}}>
          ANY PAPER
        </Typography>
      </Box>

      {/* Desktop Navigation */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
      


        {/* Conditional Rendering: Avatar or Login */}
        {user ? (
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={{ bgcolor: "#01579B", width: 24, height: 24, fontSize: 14 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
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
             
              display:"flex",
              alignItems: "center",
              gap: 1,
            
              fontFamily: "Raleway, sans-serif", // Added Raleway font
            }}
          >
            <Avatar src={require('./PersonIcon.png')} sx={{height:36, width: 36}}/>
            Log In
          </Button>
        )}
      </Box>

      {/* Mobile Menu */}
      <IconButton
        onClick={toggleDrawer}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <MenuIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
         
         
           
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
                  fontFamily: "Raleway, sans-serif", // Added Raleway font
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
  );
}

export default NavBar;