import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Radio,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FinancialReports = () => {
  const [selectedTab, setSelectedTab] = useState("Weekly");
  const [reportType, setReportType] = useState("");
  const [exportFormat, setExportFormat] = useState("PDF");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Dummy data for the chart
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [10000, 15000, 12000, 17000, 20000, 15000, 25000],
        borderColor: "orange",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box
       
      sx={{
        width:"80vw",
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
        overflow: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%", // Ensure content doesn't exceed container width
          boxSizing: "border-box",
        }}
      >
        {/* Financial Reports Section */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: "1.4rem", sm: "1.75rem" },
          }}
        >
          Financial Reports
        </Typography>

        <Grid container spacing={2}>
          {/* Chart Section */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                backgroundColor: "#fff",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
                height: { xs: 200, sm: 250 },
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden", // Prevent any potential overflow
              }}
            >
              <Line data={data} options={options} />
            </Box>
          </Grid>

          {/* Tab Section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: { xs: 0, md: 0 },
              }}
            >
              {["Weekly", "Monthly", "Yearly"].map((tab) => (
                <Button
                  key={tab}
                  variant="outlined"
                  onClick={() => setSelectedTab(tab)}
                  fullWidth
                  sx={{
                    borderRadius: 8,
                    border: `2px solid ${selectedTab === tab ? "orange" : "rgba(255,165,0,0.5)"}`,
                    backgroundColor: selectedTab === tab ? "orange" : "transparent",
                    color: selectedTab === tab ? "#fff" : "black",
                    fontWeight: "normal",
                    textTransform: "none",
                    py: 1,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    "&:hover": {
                      backgroundColor: selectedTab === tab ? "orange" : "rgba(255,165,0,0.1)",
                    },
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Generate Report Section */}
        <Box sx={{ mt: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.4rem", sm: "1.75rem" },
            }}
          >
            Generate Report
          </Typography>

          {/* Report Type */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              mb: 1,
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            Report Type:
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
            {["Revenue Report", "Expenses Report", "Loss/Profit Report"].map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Button
                  variant="outlined"
                  onClick={() => setReportType(type)}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    border: `2px solid ${reportType === type ? "orange" : "rgba(255,165,0,0.5)"}`,
                    color: reportType === type ? "orange" : "black",
                    fontWeight: "normal",
                    textTransform: "none",
                    py: 1,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    justifyContent: "flex-start",
                    "&:hover": { borderColor: "orange" },
                    whiteSpace: "nowrap", // Prevent text wrapping
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  startIcon={
                    <Radio
                      checked={reportType === type}
                      sx={{
                        color: reportType === type ? "orange" : "rgba(255,165,0,0.5)",
                        "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 18 } },
                      }}
                    />
                  }
                >
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Date Range and Export Format */}
          <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
            {/* Date Range Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                }}
              >
                Date Range:
              </Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5.5}>
                  <TextField
                    label="From"
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      display: { xs: "block" },
                      textAlign: "center",
                    }}
                  >
                    -
                  </Typography>
                </Grid>
                <Grid item xs={5.5}>
                  <TextField
                    label="To"
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Export Format Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                }}
              >
                Export Format:
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  size="small"
                  displayEmpty
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  {["PDF", "CSV", "Other"].map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Generate Report Button */}
          <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" } }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "orange",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                px: { xs: 3, sm: 4 },
                py: 1.5,
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                "&:hover": { backgroundColor: "darkorange" },
              }}
            >
              Generate Report
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinancialReports;