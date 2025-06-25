import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  TableCell,
  TableRow,
  Collapse,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  IconButton,
  Table,
  Button,
  Grid,
  CircularProgress,
  Input,
  Modal,
} from "@mui/material";
import { InsertDriveFileOutlined, KeyboardArrowUp, KeyboardArrowDown, Close } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { styled, keyframes } from "@mui/system";
import ErrorMessage from "../ErrorMessage";
import CircularProgressLoading from "../CircularProgress";

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

// Styled component for the custom tick image with smoother animation
const AnimatedTickContainer = styled(Box)(({ theme }) => ({
  animation: `${zoomInFade} 1s ease-in-out`,
  height: "40px",
  width: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#c8e6c9", // Light green background
  borderRadius: "50%",
  padding: "10px",
  marginLeft: "10px", // Reduced margin for better visibility
}));

const MyOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const STATUSES = [
    "All",
    "Completed",
    "In Revision",
    "Revision Sent Back",
    "Final Work Submitted",
    "Pending",
    "In Writing",
    "Student Requested Revision",
  ];
  const [filter1, setFilter1] = useState("All");
  const [filter2, setFilter2] = useState("All");
  const [filter3, setFilter3] = useState("None");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [revisionFile, setRevisionFile] = useState(null);
  const revisionFileInputRef = useRef(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploadingRevisionFile, setIsUploadingRevisionFile] = useState(false);
  const [isMarkingOrderAsCompleted, setIsMarkingOrderAsCompleted] = useState(false);
  const [isRevisionFileUploaded, setIsRevisionFileUploaded] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  const [error, setError] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (searchQuery && !order.typeOfPaper.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter1 !== "All" && order.status !== filter1) {
      return false;
    }
    if (filter3 !== "None") {
      const orderDate =
        filter3 === "Creation Date"
          ? order.createdAt.split("T")[0]
          : order.deadline.split("T")[0];
      if (orderDate !== selectedDate) {
        return false;
      }
    }
    return true;
  });

  const handleUploadRevisionFileChange = (e) => {
    setRevisionFile(e.target.files[0]);
    setIsRevisionFileUploaded(false);
  };

  const handleClearRevisionFile = () => {
    setRevisionFile(null);
    setIsRevisionFileUploaded(false);
    if (revisionFileInputRef.current) {
      revisionFileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "In Writing":
        return "info";
      case "In Revision":
        return "info";
      case "Revision Sent Back":
        return "warning";
      case "Final Work Submitted":
        return "success";
      case "Student Requested Revision":
        return "warning";
      default:
        return "default";
    }
  };

  const handleRowClick = (index) => {
    const newOrderId = filteredOrders[index]._id;
    if (selectedOrderId !== newOrderId) {
      setIsRevisionFileUploaded(false);
      setIsOrderCompleted(false);
      setRevisionFile(null);
      if (revisionFileInputRef.current) {
        revisionFileInputRef.current.value = "";
      }
    }
    setSelectedOrderId(newOrderId);
    setExpandedRow(expandedRow === index ? null : index);
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
    }
  };

  const markOrderAsCompleted = async () => {
    setIsMarkingOrderAsCompleted(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/mark-complete`,
        { orderId: selectedOrderId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsSnackbarOpen(true);
        setMessage(response.data.message);
        setSeverity("success");
        setIsOrderCompleted(true);
        setTimeout(() => setIsOrderCompleted(false), 3000);
        const orderIndex = orders.findIndex((order) => order._id === selectedOrderId);
        const ordersCopy = [...orders];
        ordersCopy[orderIndex] = { ...ordersCopy[orderIndex], status: "Completed" };
        setOrders(ordersCopy);
      } else {
        setIsSnackbarOpen(true);
        setMessage(response.data.message);
        setSeverity("error");
      }
    } catch (e) {
      setIsSnackbarOpen(true);
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
    } finally {
      setIsMarkingOrderAsCompleted(false);
    }
  };

  const uploadRevisionFile = async () => {
    try {
      setIsUploadingRevisionFile(true);
      const formData = new FormData();
      formData.append("file", revisionFile);
      formData.append("orderId", selectedOrderId);
      formData.append("role", "Student");
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/upload-revision`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setIsRevisionFileUploaded(true);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId
              ? { ...response.data.order }
              : order
          )
        );
        setTimeout(() => setIsRevisionFileUploaded(false), 3000);
        setRevisionFile(null);
        if (revisionFileInputRef.current) {
          revisionFileInputRef.current.value = "";
        }
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      console.error(e.message);
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUploadingRevisionFile(false);
    }
  };

  const getMyOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_STUDENT_MY_ORDERS}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(
          response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } else {
        setError(response.data.message, { style: { fontWeight: "bold" } });
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message, {
        style: { fontWeight: "bold" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  // Determine text color for bottom options
  const getOptionStyle = (option, order) => {
    console.log("Option Style Button", order);
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
    if (
      option === "First Draft Review" &&
      order.status === "In Revision" &&
      !order.isFirstDraftSubmitted
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (
      (option === "Final Draft" &&
        !order.solutionFile.name &&
        order.isFirstDraftSubmitted) ||
      (option === "Final Draft" &&
        order.solutionFile.name &&
        order.isFirstDraftSubmitted &&
        !order.revisionFile)
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (
      option === "Revision" &&
      order.solutionFile.name &&
      order.revisionFile &&
      order.isFirstDraftSubmitted
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    return { color: "#585858", fontWeight: 300 }; // Default style
  };

  if (error) {
    return <ErrorMessage message={error} onTryAgain={getMyOrders} />;
  }

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", margin: 0, padding: 0, borderRadius: 3, width: "100%" }}>
      <input type="file" hidden ref={revisionFileInputRef} onChange={handleUploadRevisionFileChange} />
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 3 }}>
        Orders
      </Typography>
      <ToastContainer />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
          gap: 2,
          alignItems: "center",
          marginBottom: 3,
          paddingX: 2,
          width: "100%",
        }}
      >
        <TextField
          placeholder="Search Topic and Subject"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "100%", md: "100%", lg: "500px" },
            bgcolor: "#fff",
            borderRadius: "50px",
            height: "40px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              height: "40px",
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr", lg: "1fr 1fr" },
            gap: 2,
            width: "100%",
          }}
        >
          <Select
            value={filter1}
            onChange={(e) => setFilter1(e.target.value)}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "50px",
              width: "100%",
              height: "40px",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
          <Select
            value={filter3}
            onChange={(e) => {
              const newValue = e.target.value;
              setFilter3(newValue);
            }}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "50px",
              width: "100%",
              height: "40px",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="None" onClick={() => setDateModelOpen(false)}>None</MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Creation Date">
              Creation Date
            </MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Due Date">
              Due Date
            </MenuItem>
          </Select>
        </Box>
      </Box>
      <Box>
        <TableContainer component={Paper} sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Topic & Subject</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Deadline</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Solution</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <CircularProgressLoading />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ marginTop: 4, color: "gray", fontWeight: "bold" }}>
                    No Orders
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      onClick={() => {
                        handleRowClick(index);
                      }}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}
                    >
                      <TableCell>{order._id.toString().slice(0, 5).toUpperCase()}</TableCell>
                      <TableCell>{order.typeOfPaper}</TableCell>
                      <TableCell>{formatDate(order.deadline)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusChipColor(order.status)}
                          sx={{
                            width: "120px",
                            fontSize: "13px",
                            bgcolor: (theme) => {
                              switch (getStatusChipColor(order.status)) {
                                case "success":
                                  return theme.palette.success.light + "33";
                                case "warning":
                                  return theme.palette.warning.light + "33";
                                case "info":
                                  return theme.palette.info.light + "33";
                                default:
                                  return theme.palette.grey[200];
                              }
                            },
                            color: (theme) => {
                              switch (getStatusChipColor(order.status)) {
                                case "success":
                                  return theme.palette.success.dark;
                                case "warning":
                                  return theme.palette.warning.dark;
                                case "info":
                                  return theme.palette.info.dark;
                                default:
                                  return theme.palette.grey[800];
                              }
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {order.solutionFile && order.solutionFile.name ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(order.solutionFile.path, order.solutionFile.name);
                            }}
                            sx={{ fontSize: "14px", color: "white", bgcolor: "orange" }}
                          >
                            Download Solution
                          </Button>
                        ) : (
                          "No Solution"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ padding: 0 }}>
                        <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                          <Box sx={{ bgcolor: "lightorange", padding: 2, marginTop: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 17,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                onClick={() => {
                                  revisionFileInputRef.current.click();
                                }}
                                sx={{ fontSize: "14px", fontWeight: "bold", color: "white", bgcolor: "orange" }}
                              >
                                Browse Files
                              </Button>
                              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                                <InsertDriveFileOutlined sx={{ height: "100px", width: "100px" }} />
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                                      {revisionFile ? revisionFile.name : "File Name Will Appear Here"}
                                    </Typography>
                                    {revisionFile && (
                                      <IconButton
                                        onClick={handleClearRevisionFile}
                                        size="small"
                                        sx={{ color: "#ff0000" }}
                                      >
                                        <Close />
                                      </IconButton>
                                    )}
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
                                  <Typography variant="caption" sx={{ mt: 1 }}>
                                    {revisionFile
                                      ? (revisionFile.size / (1024 * 1024)).toFixed(2) + " MB"
                                      : "File Size"}
                                  </Typography>
                                  {isRevisionFileUploaded && (
                                    <Typography
                                      variant="caption"
                                      sx={{ mt: 1, color: "#4caf50", fontWeight: "bold" }}
                                    >
                                      File Uploaded
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Button
                                onClick={uploadRevisionFile}
                                disabled={isUploadingRevisionFile || !revisionFile}
                                variant="contained"
                                sx={{ bgcolor: "orange", color: "#fff", padding: "8px" }}
                              >
                                {isUploadingRevisionFile ? "Uploading" : "Upload Revision"}
                              </Button>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "end",
                                alignItems: "end",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                {isOrderCompleted && (
                                  <AnimatedTickContainer>
                                    <img
                                      src={require("../landingpage/tickicon.png")}
                                      alt="Success"
                                      style={{ width: "100%", height: "100%" }}
                                    />
                                  </AnimatedTickContainer>
                                )}
                                {isOrderCompleted && (
                                  <Typography variant="caption" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                                    File Uploaded
                                  </Typography>
                                )}
                              </Box>
                              <Button
                                onClick={markOrderAsCompleted}
                                disabled={isMarkingOrderAsCompleted || order.status === "Completed"}
                                variant="contained"
                                sx={{
                                  width: "250px",
                                  height: "40px",
                                  backgroundColor: "#4CAF50",
                                  color: "#FFFFFF",
                                  "&:hover": { backgroundColor: "#45a049" },
                                  mt: 1,
                                }}
                              >
                                {isMarkingOrderAsCompleted ? (
                                  <CircularProgress sx={{ height: "12px", width: "12px", color: "white" }} thickness={7} />
                                ) : order.status === "Completed" ? (
                                  "Completed"
                                ) : (
                                  "Mark As Complete"
                                )}
                              </Button>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 2,
                              }}
                            >
                              {["First Draft", "First Draft Review", "Final Draft", "Revision"].map((option) => (
                                <Box
                                  key={option}
                                  sx={{
                                    bgcolor: "#f5f5f5",
                                    borderRadius: "50px",
                                    width: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: 1,
                                    py: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: "12px",
                                      ...getOptionStyle(option, order),
                                    }}
                                  >
                                    {option}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
      <Modal open={dateModelOpen} onClose={() => setDateModelOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "40%" },
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "orange", marginBottom: 2, fontWeight: "bold" }}>
            Pick a Date
          </Typography>
          <Grid container justifyContent="center">
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value).toISOString().split("T")[0]);
                setDateModelOpen(false);
              }}
              fullWidth
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& input": { padding: "12px", fontSize: "16px", color: "#333", borderRadius: "8px" },
                "& fieldset": { borderColor: "#FF6F00" },
                "&:hover fieldset": { borderColor: "#FF9800" },
                "&.Mui-focused fieldset": { borderColor: "#FF6F00" },
                marginBottom: 3,
              }}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyOrders;