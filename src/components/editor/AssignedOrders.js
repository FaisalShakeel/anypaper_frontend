import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Star from "@mui/icons-material/Star"; // Import Star icon
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment/moment";
import EditorDashboardLayout from "../EditorDashboardLayout";
import { styled, keyframes } from "@mui/system";
import { AttachFileOutlined } from "@mui/icons-material";
import CircularProgressLoading from "../CircularProgress";
import ErrorMessage from "../ErrorMessage";

// Smoother animation for the tick icon with a slower zoom-in effect
const zoomInFade = keyframes`
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const AnimatedTickContainer = styled(Box)(({ theme }) => ({
  animation: `${zoomInFade} 1s ease-in-out`,
  height: "30px",
  width: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#c8e6c9",
  borderRadius: "50%",
  padding: "8px",
  marginLeft: "8px",
}));

const AssignedOrders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isUploadingRevisionFile, setIsUploadingRevisionFile] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [revisionFile, setRevisionFile] = useState(null);
  const [isRevisionFileUploaded, setIsRevisionFileUploaded] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [severity, setSeverity] = useState("");
  const [orders, setOrders] = useState([]);
  const revisionFileRef = useRef();
  const [error ,setError] = useState("")

  const handleUploadRevisionFile = (e) => {
    setRevisionFile(e.target.files[0]);
    setIsRevisionFileUploaded(false);
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format("DD MMM, YYYY hh:mm A");
  };

  // Calculate remaining time for the timer
  const getRemainingTime = (deadline) => {
    const now = moment();
    const end = moment(deadline);
    if (end.isBefore(now)) {
      return { days: "00", hours: "00", minutes: "00" };
    }
    const duration = moment.duration(end.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;
    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
    };
  };

  const uploadFirstDraftRevision = async () => {
    setIsUploadingRevisionFile(true);
    try {
      const formData = new FormData();
      formData.append("file", revisionFile);
      formData.append("orderId", selectedOrderId);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/upload-first-draft-revision`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setIsRevisionFileUploaded(true);
        setTimeout(() => setIsRevisionFileUploaded(false), 3000);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUploadingRevisionFile(false);
    }
  };

  const uploadRevisionFile = async () => {
    setIsUploadingRevisionFile(true);
    try {
      const formData = new FormData();
      formData.append("file", revisionFile);
      formData.append("orderId", selectedOrderId);
      formData.append("role","Editor")
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/upload-revision`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setIsRevisionFileUploaded(true);
        setTimeout(() => setIsRevisionFileUploaded(false), 3000);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUploadingRevisionFile(false);
    }
  };

  const submitFirstDraft = async () => {
    setIsSubmittingOrder(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/submit-first-draft`,
        { orderId: selectedOrderId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setIsOrderSubmitted(true);
        setTimeout(() => setIsOrderSubmitted(false), 3000);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const submitOrder = async () => {
    setIsSubmittingOrder(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/submit`,
        { orderId: selectedOrderId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setIsOrderSubmitted(true);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
        setTimeout(() => setIsOrderSubmitted(false), 3000);
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: { "Content-Type": "application/octet-stream" },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "downloaded-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("Failed to download file");
      setSeverity("error");
      setIsSnackbarOpen(true);
    }
  };

  const handleOptionClick = (option, order) => {
    let file = null;
    let fileName = "downloaded-file";

    switch (option) {
      case "First Draft":
        if (order.firstDraft) {
          file = order.firstDraft;
          fileName = order.firstDraft.name || "FirstDraft";
        }
        break;
      case "First Draft Review":
        if (order.firstDraftRevision) {
          file = order.firstDraftRevision;
          fileName = order.firstDraftRevision.name || "FirstDraftRevision";
        }
        break;
      case "Final Draft":
        if (order.solutionFile) {
          file = order.solutionFile;
          fileName = order.solutionFile.name || "FinalDraft";
        }
        break;
      case "Revision":
        if (order.revisionFile) {
          file = order.revisionFile;
          fileName = order.revisionFile.name || "Revision";
        }
        break;
      default:
        break;
    }

    if (file && file.path) {
      handleDownload(file.path, fileName);
    } else {
      setMessage(`No ${option} file available for download`);
      setSeverity("warning");
      setIsSnackbarOpen(true);
    }
  };

  const getAssignedOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EDITOR_ORDERS}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(
          response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } else {
        setError(response.data.message ||"Failed to fetch orders!");
      }
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignedOrders();
  }, []);

  const handleExpand = (index, event) => {
    if (event.currentTarget === event.target || event.target.closest(".card-content")) {
      setExpandedCard(expandedCard === index ? null : index);
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setExpandedCard(null);
  };

  const getUploadRevisionText = (order) => {
    if (order.firstDraft && !order.isFirstDraftSubmitted) {
      return "Upload First Draft Revision";
    }
    if (order.isFirstDraftSubmitted && order.solutionFile) {
      return "Upload Final Draft Revision";
    }
    return "Upload";
  };

  const handleUploadRevision = (order) => {
    const text = getUploadRevisionText(order);
    if (text === "Upload First Draft Revision") {
      uploadFirstDraftRevision();
    } else if (text === "Upload Final Draft Revision") {
      uploadRevisionFile();
    } else {
      uploadRevisionFile();
    }
  };

  const getSubmitOrderText = (order) => {
    if (order.firstDraft && !order.isFirstDraftSubmitted) {
      return "Submit First Draft";
    }
    if (order.isFirstDraftSubmitted && order.solutionFile) {
      return "Submit Final Draft";
    }
    return "Submit Order";
  };

  const handleSubmitOrder = (order) => {
    const text = getSubmitOrderText(order);
    if (text === "Submit First Draft") {
      submitFirstDraft();
    } else if (text === "Submit Final Draft") {
      submitOrder();
    } else {
      submitOrder();
    }
  };

  const getDownloadSolutionText = (order) => {
    if (order.firstDraft && !order.isFirstDraftSubmitted) {
      return "Download First Draft";
    }
    if (order.isFirstDraftSubmitted && order.solutionFile.name) {
      return "Download Final Draft";
    }
    return "Download Solution";
  };

  const getSolutionFileName = (order) => {
    if (order.firstDraft && !order.isFirstDraftSubmitted) {
      return order.firstDraft.name || "First Draft";
    }
    if (order.isFirstDraftSubmitted && order.solutionFile.name) {
      return order.solutionFile.name || "Final Draft";
    }
    return "No Solution Uploaded!";
  };

  const getProgressDetails = (order) => {
    const status = order.status;
    if (status === "In Writing") {
      return { percentage: "33%", progress: 33 };
    }
    if (status === "In Revision" || status === "Revision Sent Back") {
      return { percentage: "66%", progress: 66 };
    }
    if (status === "Final Work Submitted" || status === "Student Requested Revision" || status === "Completed") {
      return { percentage: "100%", progress: 100 };
    }
    return { percentage: "0%", progress: 0 };
  };

  const getOptionStyle = (option, order) => {
    if (option === "First Draft" && !order.firstDraft && !order.firstDraftRevision) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (
      option === "First Draft" &&
      order.firstDraft &&
      order.status === "Revision Sent Back" &&
      !order.isFirstDraftSubmitted
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (option === "First Draft Review" && order.status === "In Revision" && !order.isFirstDraftSubmitted) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (
      (option === "Final Draft" && !order.solutionFile.name && order.isFirstDraftSubmitted) ||
      (option === "Final Draft" && order.solutionFile.name && order.isFirstDraftSubmitted && !order.revisionFile)
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (option === "Revision" && order.solutionFile.name && order.revisionFile && order.isFirstDraftSubmitted) {
      return { color: "#000000", fontWeight: "bold" };
    }
    return { color: "#585858", fontWeight: 300 };
  };

  if (loading) {
    return (
      <CircularProgressLoading/>
    );

  }
  if(!loading && error){
    return(<ErrorMessage message={error} onTryAgain={getAssignedOrders}/>)
  }
   else {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Assigned Orders
        </Typography>
        <ToastContainer />
        <input hidden ref={revisionFileRef} type="file" onChange={handleUploadRevisionFile} />
        <Grid container spacing={3}>
          {orders.length==0?<Box sx={{display:"flex", height:"60vh",width:"100%",alignItems:"center",justifyContent:"center"}}><Typography sx={{fontWeight:500,textAlign:"center"}}>No Orders</Typography></Box>:orders.map((order, index) => {
            const { percentage, progress } = getProgressDetails(order);
            const { days, hours, minutes } = getRemainingTime(order.deadline);
            return (
              <Grid
                onClick={() => {
                  setSelectedOrderId(order._id);
                }}
                item
                xs={12}
                md={expandedCard === index ? 12 : 4}
                key={index}
                sx={{ transition: "all 0.3s" }}
              >
                <Card
                  sx={{
                    backgroundColor: "white",
                    padding: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "100%",
                    position: "relative",
                    height: expandedCard === index ? "auto" : "335px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                      transform: expandedCard === index ? "none" : "scale(1.03)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={(e) => handleExpand(index, e)}
                  className="card-content"
                >
                  {expandedCard === index && (
                    <IconButton
                      onClick={handleClose}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "orange",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#ff8c00",
                          transform: "rotate(180deg)",
                          transition: "transform 0.3s ease-in-out",
                        },
                        zIndex: 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ExpandLessIcon />
                    </IconButton>
                  )}

                  {/* Top Section */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", height: "80px" }}>
                    <Box sx={{ ml: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Avatar sx={{ width: 40, height: 40 }} />
                        <Box sx={{ ml: "5px" }}>
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: "10px", mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: "14px" }}>
                              {order._id.slice(0, 5).toUpperCase()}
                            </Typography>
                            {moment(new Date(order.deadline)).fromNow()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: "14px" }}>
                          {order.typeOfPaper}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          <AttachFileOutlined sx={{ color: "orange", fontSize: "16px" }} />
                          <Typography variant="caption" sx={{ color: "orange", fontSize: "12px" }}>
                            {getSolutionFileName(order)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Middle Section - Timer, Deadline, and Progress */}
                  <Box sx={{ marginTop: 4 }}>
                    {/* Timer */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", gap: 0.3 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{days[0]}</Typography>
                        </Box>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{days[1]}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: "14px" }}>:</Typography>
                      <Box sx={{ display: "flex", gap: 0.3 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{hours[0]}</Typography>
                        </Box>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{hours[1]}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: "14px" }}>:</Typography>
                      <Box sx={{ display: "flex", gap: 0.3 }}>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{minutes[0]}</Typography>
                        </Box>
                        <Box sx={{ bgcolor: "#e0e0e0", height: "30px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="black" sx={{ fontSize: "14px" }}>{minutes[1]}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "25px", mb: 0.5 }}>
                      <Typography variant="caption" color="#000000" sx={{ fontWeight: 300, fontSize: "10px", mr: 2 }}>Days</Typography>
                      <Typography variant="caption" color="#000000" sx={{ fontWeight: 300, fontSize: "10px" }}>Hours</Typography>
                      <Typography variant="caption" color="#000000" sx={{ fontWeight: 300, fontSize: "10px", ml: 1 }}>Minutes</Typography>
                    </Box>

                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: "10px" }}>
                      Due: {formatDateTime(order.deadline)}
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#FFB7B7",
                        borderRadius: 2,
                        padding: 1,
                        mt: 1,
                        position: "relative",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#737373", fontWeight: "bold", fontSize: "10px" }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#FEA203", fontWeight: "bold", fontSize: "10px" }}>
                          {percentage}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
                        <Box
                          sx={{
                            height: "3px",
                            width: "100%",
                            backgroundColor: "#e0e0e0", // Default background
                            borderRadius: "5px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {progress >= 33 && (
                            <Box
                              sx={{
                                height: "100%",
                                width: progress === 33 ? "33%" : progress === 66 ? "66%" : "100%", // Adjust width based on progress
                                backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163", // Green for 100%, orange for 33% and 66%
                                borderRadius: "5px", // Full rounding for single color
                                position: "absolute",
                                left: 0,
                              }}
                            />
                          )}
                        </Box>
                        {progress >= 33 && (
                          <Box
                            sx={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163", // Match the bar color
                              position: "absolute",
                              left: "33%",
                              transform: "translateX(-50%)",
                              top: "50%",
                              marginTop: "-4px",
                            }}
                          />
                        )}
                        {progress >= 66 && (
                          <Box
                            sx={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163", // Match the bar color
                              position: "absolute",
                              left: "66%",
                              transform: "translateX(-50%)",
                              top: "50%",
                              marginTop: "-4px",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "black", fontSize: "10px", fontWeight: 300, mt: 0.5 }}
                      >
                        {order.status}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bottom Section */}
                  <Box sx={{ marginTop: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#FFC163", // Orange for all stages up to 66%
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {progress === 33 && (
                          <Star sx={{ color: "black", fontSize: "8px" }} />
                        )}
                      </Box>
                      <Box sx={{ width: "15px", height: "2px", backgroundColor: "#FFC163" }} />
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163", // Green only at 100%
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {progress === 66 && (
                          <Star sx={{ color: "black", fontSize: "8px" }} />
                        )}
                      </Box>
                      <Box sx={{ width: "15px", height: "2px", backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163" }} />
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: progress === 100 ? "#C0FF33" : "#FFC163", // Green only at 100%
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {progress === 100 && (
                          <Star sx={{ color: "black", fontSize: "8px" }} />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "40px" }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: "14px" }}>
                        {order.price}
                      </Typography>
                      {(order.firstDraft && !order.isFirstDraftSubmitted) || (order.solutionFile.name && order.isFirstDraftSubmitted) ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            const file = order.firstDraft && !order.isFirstDraftSubmitted ? order.firstDraft : order.solutionFile;
                            handleDownload(file.path, file.name);
                          }}
                          variant="contained"
                          sx={{
                            backgroundColor: "orange",
                            color: "white",
                            padding: "3px 10px",
                            fontSize: "12px",
                          }}
                        >
                          {getDownloadSolutionText(order)}
                        </Button>
                      ) : null}
                    </Box>
                  </Box>

                  {/* Expanded Section */}
                  {expandedCard === index && (
                    <Box sx={{ marginTop: 2 }} onClick={(e) => e.stopPropagation()}>
                      <Box
                        sx={{
                          border: "1px dotted white",
                          borderRadius: 2,
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box
                          onClick={() => {
                            console.log("Revision File Upload");
                            revisionFileRef.current.click();
                          }}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            width: "250px",
                            height: "140px",
                            border: "2px dotted orange",
                            padding: 1.5,
                            backgroundColor: "#FFF0F5",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          <CloudUploadIcon sx={{ color: "orange", fontSize: "30px" }} />
                          <Typography variant="caption" color="orange" sx={{ fontSize: "12px" }}>
                            Upload Assignment Feedback
                          </Typography>
                        </Box>
                        <Card
                          sx={{
                            padding: 1.5,
                            borderRadius: 2,
                            boxShadow: 3,
                            height: "140px",
                            width: "250px",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                            <AttachFileOutlined sx={{ fontSize: "40px" }} />
                            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "12px" }}>
                              {revisionFile ? revisionFile.name : "Revision File"}
                            </Typography>
                            {isRevisionFileUploaded && (
                              <AnimatedTickContainer>
                                <img
                                  src={require("../landingpage/tickicon.png")}
                                  alt="Success"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </AnimatedTickContainer>
                            )}
                          </Box>
                          <Box>
                            {isRevisionFileUploaded && (
                              <Typography variant="caption" sx={{ color: "#4caf50", fontWeight: "bold", mb$query: 0.5, fontSize: "10px" }}>
                                File Uploaded
                              </Typography>
                            )}
                            <Button
                              disabled={isUploadingRevisionFile || !revisionFile}
                              onClick={() => handleUploadRevision(order)}
                              variant="contained"
                              sx={{
                                backgroundColor: "orange",
                                color: "white",
                                width: "100%",
                                fontSize: "12px",
                                padding: "4px",
                              }}
                            >
                              {isUploadingRevisionFile ? "Uploading" : getUploadRevisionText(order)}
                            </Button>
                          </Box>
                        </Card>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          marginTop: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <AttachFileOutlined sx={{ fontSize: "40px" }} />
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                            <Typography variant="caption" sx={{ fontSize: "12px" }}>{getSolutionFileName(order)}</Typography>
                            {isOrderSubmitted && (
                              <AnimatedTickContainer>
                                <img
                                  src={require("../landingpage/tickicon.png")}
                                  alt="Success"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </AnimatedTickContainer>
                            )}
                          </Box>
                          <Typography variant="caption" color="textSecondary" sx={{ display: "block", fontSize: "10px" }}>
                            {(order.firstDraft && !order.isFirstDraftSubmitted && order.firstDraft.size) ||
                            (order.solutionFile && order.isFirstDraftSubmitted && order.solutionFile.size)
                              ? (
                                  (order.firstDraft && !order.isFirstDraftSubmitted
                                    ? order.firstDraft.size
                                    : order.solutionFile.size) / (1024 * 1024)
                                ).toFixed(2) + " MB"
                              : "File Size"}
                          </Typography>
                          {isOrderSubmitted && (
                            <Typography variant="caption" sx={{ color: "#4caf50", fontWeight: "bold", mb: 0.5, fontSize: "10px" }}>
                              File Uploaded
                            </Typography>
                          )}
                        </Box>
                        <Button
                          onClick={() => handleSubmitOrder(order)}
                          disabled={isSubmittingOrder}
                          variant="contained"
                          sx={{
                            marginLeft: "auto",
                            backgroundColor: "orange",
                            color: "white",
                            padding: "4px 12px",
                            marginTop: { xs: 1, sm: 0 },
                            alignSelf: "flex-end",
                            fontSize: "12px",
                          }}
                        >
                          {isSubmittingOrder ? "Submitting" : getSubmitOrderText(order)}
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {["First Draft", "First Draft Review", "Final Draft", "Revision"].map((option) => (
                          <Box
                            key={option}
                            onClick={() => handleOptionClick(option, order)}
                            sx={{
                              bgcolor: "#f5f5f5",
                              borderRadius: "50px",
                              width: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: 0.8,
                              py: 0.3,
                              cursor: "pointer", // Make it look clickable
                              "&:hover": {
                                bgcolor: "#e0e0e0", // Hover effect
                              },
                            }}
                          >
                            <Typography variant="caption" sx={{ fontSize: "10px", ...getOptionStyle(option, order) }}>
                              {option}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={2000}
          onClose={() => setIsSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={severity} onClose={() => setIsSnackbarOpen(false)}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
};

export default AssignedOrders;