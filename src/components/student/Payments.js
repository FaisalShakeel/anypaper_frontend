import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
  Button,
  TableHead,
  MenuItem,
  Modal,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Renamed from searchQuery for clarity
  const [filter1, setFilter1] = useState("All except cancelled");
  const [filter3, setFilter3] = useState("Creation Date"); // Changed filter2 to filter3 to match previous context
  const [dateModelOpen, setDateModelOpen] = useState(false); // Added for date modal
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Added for date selection

  // Define STATUSES (assuming these are payment statuses)
  const STATUSES = [
    "All",
    "All except cancelled",
    "Cancelled",
    "Completed",
    "Pending",
    "In Progress",
  ];

  const paymentHistory = [
    {
      id: "C3FW",
      date: "20 Nov,2024",
      month: "Nov",
      via: "Paypal",
      amount: "$120",
      status: "Completed", // Added status for filtering
    },
    {
      id: "DL3F",
      date: "25 Oct,2024",
      month: "Oct",
      via: "Stripe",
      amount: "$50",
      status: "Pending",
    },
    {
      id: "AL3W",
      date: "03 Dec,2023",
      month: "Dec",
      via: "Paypal",
      amount: "$450", // Fixed typo from "450" to "$450"
      status: "Completed",
    },
    {
      id: "SL3D",
      date: "30 Jun,2023",
      month: "Jun",
      via: "Solid Gate",
      amount: "$120",
      status: "In Progress",
    },
    {
      id: "LS33",
      date: "04 Aug,2024",
      month: "Aug",
      via: "Paypal",
      amount: "$300",
      status: "Completed",
    },
  ];

  // Filter payment history based on search, status, and date
  const filteredPayments = paymentHistory.filter((payment) => {
    // Search filter (by ID or via)
    if (searchQuery && !payment.id.toLowerCase().includes(searchQuery.toLowerCase()) && !payment.via.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filter1 === "All except cancelled" && payment.status === "Cancelled") {
      return false;
    } else if (filter1 !== "All" && filter1 !== "All except cancelled" && payment.status !== filter1) {
      return false;
    }

    // Date filter
    if (filter3 !== "None") {
      const paymentDate = new Date(payment.date).toISOString().split("T")[0];
      if (paymentDate !== selectedDate) {
        return false;
      }
    }

    return true;
  });

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", margin: 0, padding: 0, borderRadius: 3, width: "100%" }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 3 }}>
        Payments {/* Changed from "Orders" to "Payments" for clarity */}
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
                         placeholder="Search Payment Via ID"
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
                          {STATUSES.map((status)=>{
                            return(
                           <MenuItem value={status}>{status}</MenuItem>
      
      
                            )
                          })}
                          
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

      {/* Payments Table */}
      <TableContainer
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <Table sx={{ minWidth: 650, borderCollapse: "separate", borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                Order ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                Date
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                Payment Via
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                Month
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                Amount
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "15px", borderBottom: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "darkorange" },
                  }}
                >
                  Download All
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ borderBottom: "none", fontSize: "14px", color: "gray" }}>
                  No Payments Found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px" }}>
                    {row.id}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px" }}>
                    {row.date}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px" }}>
                    {row.via}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px" }}>
                    {row.month}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px" }}>
                    {row.amount}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: "none", fontSize: "14px", color: "orange", fontWeight: "bold" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography>View All</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "8px",
                          width: "24px",
                          height: "24px",
                          border: "2px solid orange",
                          borderRadius: "50%",
                        }}
                      >
                        <KeyboardArrowDownIcon sx={{ color: "orange", fontSize: "18px" }} />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
                "& input": { padding: "12px", fontSize: "16px", color: "#333" },
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

export default Payments;