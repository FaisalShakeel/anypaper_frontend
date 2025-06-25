import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Chip,
  Button,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  TableHead,
  TableBody,
  IconButton,
  Paper,
  Modal,
  Grid,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  InsertDriveFileOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
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
  marginLeft: "50px", // Moved further to the right
  marginRight: "100px", // Increased gap between tick and button
}));

// Reusable style for rounded inputs/selects without borders
const roundedInputStyle = {
  bgcolor: "#ffffff",
  borderRadius: "50px",
  width: "100%",
  boxShadow: "none",
  ".MuiOutlinedInput-notchedOutline": { border: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
};

const MyOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateModelOpen, setDateModelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filter1, setFilter1] = useState("All");
  const [filter3, setFilter3] = useState("None");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [solutionFile, setSolutionFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const solutionFileInputRef = useRef(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isUploadingSolutionFile, setIsUploadingSolutionFile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error ,setError] = useState("")

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

  // Format date helper
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  // Get chip background color based on status (light shadow-like tint)
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

  // Filter orders based on search, status, and date
  const filteredOrders = orders.filter((order) => {
    if (searchQuery && !order.typeOfPaper.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter1 !== "All" && order.status !== filter1) {
      return false;
    }
    if (filter3 !== "None" && selectedDate) {
      const orderDate =
        filter3 === "Creation Date" && order.createdAt
          ? order.createdAt.split("T")[0]
          : filter3 === "Due Date" && order.deadline
          ? order.deadline.split("T")[0]
          : null;
      if (!orderDate || orderDate !== selectedDate) {
        return false;
      }
    }
    return true;
  });

  // Handle row expansion
  const handleRowClick = (index) => {
    const newOrderId = filteredOrders[index]._id;
    if (selectedOrderId !== newOrderId) {
      setIsFileUploaded(false); // Reset uploaded status when a new order is clicked
      setSolutionFile(null); // Reset the selected file when switching orders
    }
    setSelectedOrderId(newOrderId);
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Handle file download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, { method: "GET" });
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

  // Handle file selection
  const handleUploadSolutionFileChange = (e) => {
    setSolutionFile(e.target.files[0]);
    setIsFileUploaded(false); // Reset upload status when a new file is selected
  };

  // Handle option click for downloading files
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

  // Determine the text for the Upload Solution button
  const getUploadButtonText = (order) => {
    if ((order.firstDraft || !order.firstDraft) && !order.isFirstDraftSubmitted && !order.firstDraftRevision) {
      return "Upload First Draft";
    }
    if (order.firstDraft && !order.isFirstDraftSubmitted && order.firstDraftRevision) {
      if (order.status === "Revision Sent Back" || order.status === "In Revision") {
        return "Upload Revised First Draft";
      }
      return "Upload First Draft"; // If first draft exists but not submitted
    }
    if (order.isFirstDraftSubmitted) {
      if (
        (order.status === "Student Requested Revision" || order.status === "Final Work Submitted") &&
        (order.solutionFile.name && order.revisionFile)
      ) {
        return "Upload Revised Final Draft";
      }
      return "Upload Final Draft";
    }
    return "Upload Solution"; // Default fallback
  };

  // Determine the text for the Revision column
  const getRevisionText = (order) => {
    if (order.firstDraftRevision && !order.isFirstDraftSubmitted) {
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(order.firstDraftRevision.path, order.firstDraftRevision.name);
          }}
          sx={{ fontSize: "14px", color: "white", bgcolor: "orange" }}
        >
          Download First Draft Revision
        </Button>
      );
    }
    if (order.isFirstDraftSubmitted && order.revisionFile) {
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(order.revisionFile.path, order.revisionFile.name);
          }}
          sx={{ fontSize: "14px", color: "white", bgcolor: "orange" }}
        >
          Download Final Draft Revision
        </Button>
      );
    }
    if (order.revisionFile) {
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(order.revisionFile.path, order.revisionFile.name);
          }}
          sx={{ fontSize: "14px", color: "white", bgcolor: "orange" }}
        >
          Download Revision
        </Button>
      );
    }
    return "No Revision";
  };

  // Upload first draft
  const uploadFirstDraft = async () => {
    try {
      setIsUploadingSolutionFile(true);
      const formData = new FormData();
      formData.append("file", solutionFile);
      formData.append("orderId", selectedOrderId);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/upload-first-draft`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsFileUploaded(true); // Mark file as uploaded
        setTimeout(() => setIsFileUploaded(false), 3000); // Hide the tick after 3 seconds
        // Update the orders state to reflect the uploaded file and submission status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
      } else {
        setMessage(response.data.message);
        setSeverity("error");
      }
      setIsSnackbarOpen(true);
    } catch (e) {
      setMessage(e.response?.data?.message || e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUploadingSolutionFile(false);
    }
  };

  // Upload solution file (final draft)
  const uploadSolutionFile = async () => {
    try {
      setIsUploadingSolutionFile(true);
      const formData = new FormData();
      formData.append("file", solutionFile);
      formData.append("orderId", selectedOrderId);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/upload-solution`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsFileUploaded(true); // Mark file as uploaded
        setTimeout(() => setIsFileUploaded(false), 3000); // Hide the tick after 3 seconds
        // Update the orders state to reflect the uploaded file
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId ? { ...response.data.order } : order
          )
        );
      } else {
        setMessage(response.data.message);
        setSeverity("error");
      }
      setIsSnackbarOpen(true);
    } catch (e) {
      setMessage(e.response?.data?.message || e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUploadingSolutionFile(false);
    }
  };

  // Handle upload based on button text
  const handleUpload = (order) => {
    const buttonText = getUploadButtonText(order);
    if (buttonText === "Upload First Draft" || buttonText === "Upload Revised First Draft") {
      uploadFirstDraft();
    } else if (buttonText === "Upload Final Draft" || buttonText === "Upload Revised Final Draft") {
      uploadSolutionFile();
    } else {
      uploadSolutionFile(); // Default fallback
    }
  };

  // Fetch orders
  const getMyOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_WRITER_ORDERS}`, {
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
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  // Determine text color for bottom options
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
    if (
      option === "First Draft Review" &&
      order.status === "In Revision" &&
      !order.isFirstDraftSubmitted
    ) {
      return { color: "#000000", fontWeight: "bold" };
    }
    if (
      (option === "Final Draft" && !order.solutionFile.name && order.isFirstDraftSubmitted) ||
      (option === "Final Draft" && order.solutionFile.name && order.isFirstDraftSubmitted && !order.revisionFile)
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
  if(error && !loading){
    return(<ErrorMessage message={error} onTryAgain={getMyOrders}/>)
  }

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", p: 2, borderRadius: 3, width: "100%" }}>
      <ToastContainer />
      <input
        type="file"
        hidden
        ref={solutionFileInputRef}
        onChange={handleUploadSolutionFileChange}
      />
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        My Orders
      </Typography>

      {/* Filters Row */}
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
                <Search />
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
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
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
            sx={roundedInputStyle}
          >
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={filter3}
            onChange={(e) => {
              const newValue = e.target.value;
              setFilter3(newValue);
            }}
            sx={roundedInputStyle}
          >
            <MenuItem value="None" onClick={() => setDateModelOpen(false)}>
              None
            </MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Creation Date">
              Creation Date
            </MenuItem>
            <MenuItem onClick={() => setDateModelOpen(true)} value="Due Date">
              Due Date
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Order Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Payout</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Revision</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "15px" }}>Material</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgressLoading/>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ mt: 4, color: "gray", fontWeight: "bold" }}>
                  No Orders
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <TableRow
                    onClick={() => {
                      handleRowClick(index);
                    }}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}
                  >
                    <TableCell>{order._id.toString().slice(0, 5).toUpperCase()}</TableCell>
                    <TableCell>{order.typeOfPaper}</TableCell>
                    <TableCell>{formatDate(order.deadline)}</TableCell>
                    <TableCell>$0</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusChipColor(order.status)}
                        sx={{
                          width: "120px",
                          fontSize: "13px",
                          // Use lighter background shades based on color prop
                          bgcolor: (theme) => {
                            switch (getStatusChipColor(order.status)) {
                              case "success":
                                return theme.palette.success.light + "33"; // Light success with 20% opacity
                              case "warning":
                                return theme.palette.warning.light + "33"; // Light warning with 20% opacity
                              case "info":
                                return theme.palette.info.light + "33"; // Light info with 20% opacity
                              default:
                                return theme.palette.grey[200]; // Light grey for default
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
                    <TableCell>{getRevisionText(order)}</TableCell>
                    <TableCell>
                      {order.materialFile ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(order.materialFile.path, order.materialFile.name);
                          }}
                          sx={{ fontSize: "14px", color: "white", bgcolor: "orange" }}
                        >
                          Download Material
                        </Button>
                      ) : (
                        "No Material"
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0 }}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <Box sx={{ bgcolor: "#ffffff", p: 2, mt: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 2,
                              flexDirection: { xs: "column", md: "row" },
                              alignItems: "center",
                            }}
                          >
                            <Button
                              onClick={() => solutionFileInputRef.current.click()}
                              sx={{ fontSize: "14px", fontWeight: "bold", color: "white", bgcolor: "orange" }}
                            >
                              Browse Files
                            </Button>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                              <InsertDriveFileOutlined sx={{ height: "100px", width: "100px" }} />
                              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                  <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                                    {solutionFile ? solutionFile.name : "File Name Will Appear Here"}
                                  </Typography>
                                  {isFileUploaded && (
                                    <AnimatedTickContainer>
                                      <img
                                        src={require("../landingpage/tickicon.png")}
                                        alt="Success"
                                        style={{ width: "100%", height: "100%" }}
                                      />
                                    </AnimatedTickContainer>
                                  )}
                                  <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                      onClick={() => handleUpload(order)}
                                      disabled={isUploadingSolutionFile || !solutionFile}
                                      variant="contained"
                                      sx={{ bgcolor: "orange", color: "#fff", padding: "8px" }}
                                    >
                                      {isUploadingSolutionFile ? "Uploading" : getUploadButtonText(order)}
                                    </Button>
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="caption" sx={{ mt: 1 }}>
                                    {solutionFile
                                      ? (solutionFile.size / (1024 * 1024)).toFixed(2) + " MB"
                                      : "File Size"}
                                  </Typography>
                                  {isFileUploaded && (
                                    <Typography
                                      variant="caption"
                                      sx={{ mt: 1, color: "#4caf50", fontWeight: "bold" }}
                                    >
                                      File Uploaded
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          {/* Four options at the bottom center */}
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
                                onClick={() => handleOptionClick(option, order)}
                                sx={{
                                  bgcolor: "#f5f5f5",
                                  borderRadius: "50px",
                                  width: "auto",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  px: 1,
                                  py: 0.5,
                                  cursor: "pointer", // Make it look clickable
                                  "&:hover": {
                                    bgcolor: "#e0e0e0", // Hover effect
                                  },
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

      {/* Snackbar for notifications */}
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

      {/* Date Picker Modal */}
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
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "orange", mb: 2, fontWeight: "bold" }}>
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
                "& input": { padding: "12px", fontSize: "16px", color: "#333" },
                "& fieldset": { borderColor: "#FF6F00" },
                "&:hover fieldset": { borderColor: "#FF9800" },
                "&.Mui-focused fieldset": { borderColor: "#FF6F00" },
                mb: 3,
              }}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyOrders;