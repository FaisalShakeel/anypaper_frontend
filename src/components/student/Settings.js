import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import WcIcon from "@mui/icons-material/Wc";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";
import { AuthContext } from "../../contexts/AuthContext";

const Settings = () => {
  const { setUser } = useContext(AuthContext)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(1);

  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Old and new passwords are required!");
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/students/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/students/get-profile`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setFullName(response.data.student.fullName);
        setEmail(response.data.student.email);
        setPhoneNumber(response.data.student.phoneNumber);
        setGender(response.data.student.gender);
      } else {
        setError(response.data.message);
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/students/update-profile`,
        { fullName, email, gender, phoneNumber },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message, { style: { fontWeight: "bold" } });
        setUser(response.data.student)
      } else {
        toast.error(response.data.message, { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message, {
        style: { fontWeight: "bold" },
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Render loading or error states first to prevent UI flash
  if (loading) {
    return <CircularProgressLoading />;
  }

  if (error) {
    return <ErrorMessage message={error} onTryAgain={getProfile} />;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Button
          onClick={() => {
            setTab(1);
          }}
          sx={{
            border: "1px solid #FFA726",
            borderRadius: "20px",
            color: tab === 1 ? "white" : "black",
            backgroundColor: tab === 1 ? "#FFA726" : "",
            textTransform: "none",
            padding: "8px 16px",
            width: { xs: "80%", sm: "auto" },
            "&:hover": {
              backgroundColor: "#FFE0B2",
              borderColor: "#FFB74D",
            },
          }}
        >
          Profile Information
        </Button>
        <Button
          onClick={() => {
            setTab(2);
          }}
          sx={{
            border: "1px solid #FFA726",
            borderRadius: "20px",
            color: tab === 2 ? "white" : "black",
            backgroundColor: tab === 2 ? "#FFA726" : "",
            textTransform: "none",
            padding: "8px 16px",
            width: { xs: "80%", sm: "auto" },
            "&:hover": {
              backgroundColor: "#FFE0B2",
              borderColor: "#FFB74D",
            },
          }}
        >
          Change Password
        </Button>
      </Box>

      {tab === 1 ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            padding: 3,
            mt: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Basic Information
          </Typography>

          <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                Name
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <PersonIcon />
                <TextField
                  fullWidth
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  variant="outlined"
                  placeholder="Enter your name"
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                Email
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <EmailIcon />
                <TextField
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your email"
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                Gender
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <WcIcon />
                <TextField
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your gender"
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                Phone Number
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <PhoneIcon />
                <TextField
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your phone number"
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
            }}
          >
            <Button
              disabled={isUpdatingProfile}
              onClick={updateProfile}
              sx={{
                bgcolor: "#FFA726",
                color: "white",
                height: "43px",
                width: "140px",
                borderRadius: "5px",
              }}
            >
              {isUpdatingProfile ? (
                <CircularProgress
                  style={{ height: "15px", width: "15px", color: "white" }}
                  thickness={10}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            mt: 2,
            borderRadius: 2,
            padding: 3,
            marginBottom: 3,
          }}
        >
          <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ marginBottom: 2 }}>
            <Grid item xs={12}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                Old Password
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <LockIcon />
                <TextField
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter old password"
                  type={showOldPassword ? "text" : "password"}
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ color: "black", marginBottom: 1 }}>
                New Password
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#ffe6f2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  height: "48px",
                  borderRadius: 1,
                }}
              >
                <LockIcon />
                <TextField
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter new password"
                  type={showNewPassword ? "text" : "password"}
                  sx={{
                    backgroundColor: "#ffe6f2",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffe6f2",
                      borderRadius: "5px",
                      height: "40px",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
            }}
          >
            <Button
              onClick={changePassword}
              disabled={isChangingPassword}
              sx={{
                bgcolor: "#FFA726",
                color: "white",
                height: "43px",
                width: "140px",
                borderRadius: "5px",
              }}
            >
              {isChangingPassword ? (
                <CircularProgress
                  style={{ height: "15px", width: "15px", color: "white" }}
                  thickness={10}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Settings;