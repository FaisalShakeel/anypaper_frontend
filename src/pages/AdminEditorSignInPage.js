import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Star, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminEditorSignInPage() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingInAsEditor, setIsLoggingInAsEditor] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const login = async () => {
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ADMIN_LOGIN}`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.admin);
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginAsEditor = async () => {
    setIsLoggingInAsEditor(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_EDITOR_LOGIN}`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.editor);
        setTimeout(() => {
          navigate("/editor/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsLoggingInAsEditor(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        px: 2,
      }}
    >
      <ToastContainer />
      <Grid
        container
        sx={{
          maxWidth: 1200,
          height: { xs: "auto", md: 600 },
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Image Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: { xs: "250px", md: "100%" },
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            overflow: "hidden",
          }}
        >
          {/* Image Container */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              height: "90%",
              padding: "20px",
            }}
          >
            {/* Skybluestars Image (Left of Ladygirl, Moved Right and Downward) */}
            <img
              src={require("../components/landingpage/skybluestars.png")}
              alt="Skybluestars"
              style={{
                width: "25%",
                height: "auto",
                objectFit: "contain",
                position: "absolute",
                top: "30%", // Moved down from 20% to 30%
                left: "15%", // Used left instead of right to ensure left side is visible
                zIndex: 1,
                padding: "5px", // Added padding to ensure full visibility
              }}
            />
            {/* Ladygirl Image (Centered) */}
            <img
              src={require("../components/landingpage/ladygirl.png")}
              alt="Ladygirl"
              style={{
                width: "40%",
                height: "60%",
                objectFit: "contain",
                position: "relative",
                zIndex: 2,
              }}
            />
          </Box>
        </Grid>

        {/* Right Form Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Centered Title */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
            >
              Sign In
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", fontSize: "1rem" }}
            >
              Stay Connected and Organized
            </Typography>
          </Box>

          {/* Input Fields */}
          <Box sx={{ width: "100%", maxWidth: 450, mt: -2 }}>
            {/* Email Field */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Email <Star sx={{ fontSize: 10, color: "red", ml: 0.5 }} />
              </Typography>
              <TextField
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                fullWidth
                placeholder="Enter email here"
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: "8px", fontSize: "1rem", height: "40px" },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Password <Star sx={{ fontSize: 10, color: "red", ml: 0.5 }} />
              </Typography>
              <TextField
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                fullWidth
                placeholder="Enter password here"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: "8px", fontSize: "1rem", height: "40px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Sign In Button */}
            <Button
              onClick={login}
              disabled={isLoggingIn}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#FFA726",
                color: "white",
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                py: 1.5,
                "&:hover": { backgroundColor: "#FB8C00" },
              }}
            >
              {isLoggingIn ? "Signing In" : "Sign In"}
            </Button>

            {/* Sign In As Editor Button */}
            <Button
              onClick={loginAsEditor}
              disabled={isLoggingInAsEditor}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#FFA726",
                color: "white",
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                py: 1.5,
                "&:hover": { backgroundColor: "#FB8C00" },
              }}
            >
              {isLoggingInAsEditor ? "Signing In" : "Sign In As Editor"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}