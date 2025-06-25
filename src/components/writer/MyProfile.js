import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, Grid, TextField, Button, Avatar, IconButton, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import WcIcon from "@mui/icons-material/Wc";
import EditIcon from "@mui/icons-material/Edit";
import { ShoppingCart, Done, Star, HourglassEmpty, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import WriterDashboardLayout from "../WriterDashboardLayout";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";
import { AuthContext } from "../../contexts/AuthContext";
import OrdersModal from "../OrdersModel";
import RatingsModal from "../RatingsModel";

const MyProfile = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileStatistics, setProfileStatistics] = useState({});
  const [tab, setTab] = useState(1);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfileInformation, setIsUpdatingProfileInformation] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [openRatingsModal, setOpenRatingsModal] = useState(false);
  const [openOrdersModal, setOpenOrdersModal] = useState(false);
  const profileImageInputRef = useRef(null);

  const handleProfileImageChange = async (e) => {
    setProfileImage(e.target.files[0]);
    setPhotoUrl(URL.createObjectURL(e.target.files[0]));
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.info("Old and new passwords are required!");
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/writers/change-password`,
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

  const updateProfileInformation = async () => {
    setIsUpdatingProfileInformation(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("gender", gender);
      if (profileImage) {
        formData.append("file", profileImage);
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/writers/update-profile-information`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.writer);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setIsUpdatingProfileInformation(false);
    }
  };

  const getWriterProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/writers/profile`, {
        withCredentials: true,
      });
      console.log("Writer Profile", response.data);
      if (response.data.success) {
        setName(response.data.writerDetails.name);
        setEmail(response.data.writerDetails.email);
        setPhoneNumber(response.data.writerDetails.phoneNumber);
        setGender(response.data.writerDetails.gender);
        setRating(response.data.writerDetails.rating);
        setPhotoUrl(response.data.writerDetails.photoUrl);
        setProfileStatistics(response.data.statistics);
      } else {
        setError(response.data.message || "Failed to fetch profile!");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message || "Failed to fetch profile!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWriterProfile();
  }, []);

  if (loading) {
    return <CircularProgressLoading />;
  }

  if (error) {
    return <ErrorMessage message={error} onTryAgain={getWriterProfile} />;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <ToastContainer />
      <input hidden ref={profileImageInputRef} type="file" onChange={handleProfileImageChange} />
      <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "15px", textAlign: "center", mt: 3, mb: 2 }}>
        My Profile
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
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
            width: { xs: "100%", sm: "auto" },
            maxWidth: "200px",
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
            width: { xs: "100%", sm: "auto" },
            maxWidth: "200px",
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
        <>
          <Box sx={{ backgroundColor: "white", mt: 2, borderRadius: 2, padding: 3, marginBottom: 3 }}>
            {/* Avatar and Edit Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 70, height: 70 }} src={photoUrl} />
                <IconButton
                  onClick={() => {
                    profileImageInputRef.current.click();
                  }}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "orange",
                    padding: "4px",
                    borderRadius: "50%",
                  }}
                >
                  <EditIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </Box>

            {/* Basic Information */}
            {/* First Row: Name and Email */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "black", marginBottom: 1 }}>Name</Typography>
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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    fullWidth
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
                <Typography sx={{ color: "black", marginBottom: 1 }}>Email</Typography>
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

            {/* Second Row: Gender and Phone Number */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "black", marginBottom: 1 }}>Gender</Typography>
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
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                    value={gender}
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
                <Typography sx={{ color: "black", marginBottom: 1 }}>Phone Number</Typography>
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
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                    value={phoneNumber}
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

            {/* Update Button */}
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
              <Button
                onClick={updateProfileInformation}
                disabled={isUpdatingProfileInformation}
                sx={{ bgcolor: "#FFA726", color: "white", height: "43px", width: "140px", borderRadius: "5px" }}
              >
                {isUpdatingProfileInformation ? "Updating" : "Update"}
              </Button>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "15px" }}>
            Performance Overview
          </Typography>

          {/* Cards Section */}
          <Box sx={{ backgroundColor: "white", borderRadius: 2, padding: 2 }}>
            <Grid container spacing={2}>
              {/* Total Orders Card */}
              <Grid item xs={12} lg={3}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minHeight: "200px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      Total Orders
                    </Typography>
                    <Box sx={{ bgcolor: "lightgreen", borderRadius: "50%", padding: 0.5 }}>
                      <Done sx={{ color: "green", fontSize: "20px" }} />
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "24px",
                      fontWeight: "700",
                      paddingLeft: "10px",
                      marginBottom: 1,
                    }}
                  >
                    {profileStatistics.totalOrders || 0}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "start", gap: 0.5, alignItems: "start" }}>
                    <ArrowDownward sx={{ color: "blue", fontSize: "16px" }} />
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>0%</Typography>
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>Prev 30 Days</Typography>
                  </Box>

                  <Button
                    onClick={() => navigate("/writer/my-orders")}
                    sx={{
                      bgcolor: "orange",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "auto",
                      padding: "6px 12px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    View Orders
                  </Button>
                </Box>
              </Grid>

              {/* Successful Bids Card */}
              <Grid item xs={12} lg={3}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minHeight: "200px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      Successful Bids
                    </Typography>
                    <Box sx={{ bgcolor: "lightgreen", borderRadius: "50%", padding: 0.5 }}>
                      <Done sx={{ color: "green", fontSize: "20px" }} />
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "24px",
                      fontWeight: "700",
                      paddingLeft: "10px",
                      marginBottom: 1,
                    }}
                  >
                    {profileStatistics.successfulBids || 0} / {profileStatistics.totalBids ||0}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "start", gap: 0.5, alignItems: "start" }}>
                    <ArrowUpward sx={{ color: "green", fontSize: "16px" }} />
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>0%</Typography>
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>Prev 30 Days</Typography>
                  </Box>

                  <Button
                    onClick={() => navigate("/writer/bid-orders")}
                    sx={{
                      bgcolor: "orange",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "auto",
                      padding: "6px 12px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    Bid More
                  </Button>
                </Box>
              </Grid>

              {/* Average Rating Card */}
              <Grid item xs={12} lg={3}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minHeight: "200px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      Average Rating
                    </Typography>
                    <Box sx={{ bgcolor: "lightblue", borderRadius: "50%", padding: 0.5 }}>
                      <Star sx={{ color: "blue", fontSize: "20px" }} />
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "24px",
                      fontWeight: "700",
                      paddingLeft: "10px",
                      marginBottom: 1,
                    }}
                  >
                    {rating || 0}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "start", gap: 0.5, alignItems: "start" }}>
                    <ArrowDownward sx={{ color: "blue", fontSize: "16px" }} />
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>0%</Typography>
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>Prev 30 Days</Typography>
                  </Box>

                  <Button
                    onClick={() => setOpenRatingsModal(true)}
                    sx={{
                      bgcolor: "orange",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "auto",
                      padding: "6px 12px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    View Ratings
                  </Button>
                </Box>
              </Grid>

              {/* Pending Orders Card */}
              <Grid item xs={12} lg={3}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minHeight: "200px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      Pending Orders
                    </Typography>
                    <Box sx={{ bgcolor: "lightgreen", borderRadius: "50%", padding: 0.5 }}>
                      <Done sx={{ color: "green", fontSize: "20px" }} />
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "24px",
                      fontWeight: "700",
                      paddingLeft: "10px",
                      marginBottom: 1,
                    }}
                  >
                    {profileStatistics.pendingOrders.length || 0}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "start", gap: 0.5, alignItems: "start" }}>
                    <ArrowUpward sx={{ color: "green", fontSize: "16px" }} />
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>0%</Typography>
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>Prev 30 Days</Typography>
                  </Box>

                  <Button
                    onClick={() => setOpenOrdersModal(true)}
                    sx={{
                      bgcolor: "orange",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "auto",
                      padding: "6px 12px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    View Orders
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ backgroundColor: "white", mt: 2, borderRadius: 2, padding: 3, marginBottom: 3 }}>
            {/* Third Row: Password */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12}>
                <Typography sx={{ color: "black", marginBottom: 1 }}>Old Password</Typography>
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
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ color: "black", marginBottom: 1 }}>New Password</Typography>
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
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            {/* Update Button */}
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
              <Button
                onClick={changePassword}
                disabled={isChangingPassword}
                sx={{ bgcolor: "#FFA726", color: "white", height: "43px", width: "140px", borderRadius: "5px" }}
              >
                {isChangingPassword ? "Updating" : "Update"}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Ratings Modal */}
      <RatingsModal
        open={openRatingsModal}
        onClose={() => setOpenRatingsModal(false)}
        ratings={profileStatistics.ratings || []}
      />

      {/* Orders Modal for Pending Orders */}
      <OrdersModal
        open={openOrdersModal}
        onClose={() => setOpenOrdersModal(false)}
        orders={profileStatistics?.pendingOrders}
      />
    </Box>
  );
};

export default MyProfile;