import { Typography, TextField, Box, Button, MenuItem, Grid, Accordion, AccordionSummary, AccordionDetails, Snackbar, Alert, Stepper, Step, StepLabel } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NavBar from "../components/landingpage/navbar";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useOrderContext } from "../contexts/OrderContext";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LockIcon from "@mui/icons-material/Lock";
import { useStudentSignUpLoginContext } from "../contexts/StudentSignUpLoginContext";
import CustomStepper from "../components/customstepper";
import GavelIcon from "@mui/icons-material/Gavel";
import { AuthContext } from "../contexts/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { toast,ToastContainer } from "react-toastify";

function PlaceOrderStep2() {
  const {
    alreadyHaveAccount, setAlreadyHaveAccount,
    fullName, setFullName,
    email, setEmail,
    phoneNumber, setPhoneNumber,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading, setLoading,
    createAccount, login,
    message, setMessage,
    severity, setSeverity,
    open, setOpen
  } = useStudentSignUpLoginContext();
  const { typeOfPaper, quantity, deadline, studentPrice, fieldOfStudy, academicLevel, specificRequirements, noOfSources, referenceStyle } = useOrderContext();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const steps = [
    "Subject Information",
    "Account",
    "Payment",
    "Order in Progress",
  ];

  const countries = [
    { code: "+355", country: "Albania", flag: "al" },
    { code: "+61", country: "Australia", flag: "au" },
    { code: "+43", country: "Austria", flag: "at" },
    { code: "+55", country: "Brazil", flag: "br" },
    { code: "+1", country: "Canada", flag: "ca" },
    { code: "+86", country: "China", flag: "cn" },
    { code: "+20", country: "Egypt", flag: "eg" },
    { code: "+33", country: "France", flag: "fr" },
    { code: "+49", country: "Germany", flag: "de" },
    { code: "+30", country: "Greece", flag: "gr" },
    { code: "+91", country: "India", flag: "in" },
    { code: "+353", country: "Ireland", flag: "ie" },
    { code: "+39", country: "Italy", flag: "it" },
    { code: "+81", country: "Japan", flag: "jp" },
    { code: "+82", country: "South Korea", flag: "kr" },
    { code: "+52", country: "Mexico", flag: "mx" },
    { code: "+31", country: "Netherlands", flag: "nl" },
    { code: "+64", country: "New Zealand", flag: "nz" },
    { code: "+47", country: "Norway", flag: "no" },
    { code: "+63", country: "Philippines", flag: "ph" },
    { code: "+48", country: "Poland", flag: "pl" },
    { code: "+351", country: "Portugal", flag: "pt" },
    { code: "+7", country: "Russia", flag: "ru" },
    { code: "+27", country: "South Africa", flag: "za" },
    { code: "+34", country: "Spain", flag: "es" },
    { code: "+46", country: "Sweden", flag: "se" },
    { code: "+41", country: "Switzerland", flag: "ch" },
    { code: "+90", country: "Turkey", flag: "tr" },
    { code: "+971", country: "United Arab Emirates", flag: "ae" },
    { code: "+44", country: "United Kingdom", flag: "gb" },
    { code: "+1", country: "United States", flag: "us" },
    { code: "+598", country: "Uruguay", flag: "uy" },
    { code: "+226", country: "Burkina Faso", flag: "bf" },
    { code: "+973", country: "Bahrain", flag: "bh" },
    { code: "+54", country: "Argentina", flag: "ar" },
    { code: "+974", country: "Qatar", flag: "qa" },
    { code: "+1", country: "Jamaica", flag: "jm" },
    { code: "+52", country: "Dominican Republic", flag: "do" },
    { code: "+57", country: "Colombia", flag: "co" },
    { code: "+960", country: "Maldives", flag: "mv" },
    { code: "+48", country: "Lithuania", flag: "lt" },
    { code: "+63", country: "Vietnam", flag: "vn" },
    { code: "+66", country: "Thailand", flag: "th" },
    { code: "+971", country: "United Arab Emirates", flag: "ae" },
    { code: "+246", country: "British Indian Ocean Territory", flag: "io" },
  ];

  const questionsAndAnswers = [
    {
      icon: <GavelIcon />,
      question: "No Plagiarism And AI",
      answer: "You will receiver 100% work tailored to your instructions by a qualified subject matter writer.No AI used"
    },
    {
      icon: <AttachMoneyIcon />,
      question: "Money Back",
      answer: "Your order is protected by a 14-day money back guarantee.No questions asked.You are safe here"
    },
    {
      icon: <LockIcon />,
      question: "Confidentiality",
      answer: "All data is safeguarded and never shared.Communication with writers and support team is anonymous.Rest assured,nobody will ever find out you used our site"
    }
  ];

  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (alreadyHaveAccount) {
      if (!email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
      if (!password) {
        newErrors.password = "Password is required";
        isValid = false;
      }
    } else {
      if (!fullName) {
        newErrors.fullName = "Full Name is required";
        isValid = false;
      }
      if (!email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone Number is required";
        isValid = false;
      }
      if (!password) {
        newErrors.password = "Password is required";
        isValid = false;
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required";
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }
    if(!isValid){
      toast.error("Please fill the required fields!")
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextClick = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (alreadyHaveAccount) {
        const statusCode = await login(email, password);
        if (statusCode === 200) {
          navigate("/student/placeorder/step/3");
        }
      } else {
        const statusCode = await createAccount(fullName, email, phoneNumber, password, confirmPassword);
        if (statusCode === 201) {
          navigate("/student/placeorder/step/3");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <ToastContainer/>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <NavBar />

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <CustomStepper steps={steps} activeStep={2} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 6,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {alreadyHaveAccount ? (
            <Box
              sx={{
                flex: 2,
                backgroundColor: "#fff",
                p: 4,
                borderRadius: 4,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Box
                  onClick={() => setAlreadyHaveAccount(false)}
                  sx={{
                    borderRadius: "20px",
                    border: `2px solid ${alreadyHaveAccount ? "#ddd" : "orange"}`,
                    padding: "10px 20px",
                    cursor: "pointer",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>I'm New Here</Typography>
                </Box>
                <Box
                  onClick={() => setAlreadyHaveAccount(true)}
                  sx={{
                    borderRadius: "20px",
                    border: `2px solid ${alreadyHaveAccount ? "orange" : "#ddd"}`,
                    padding: "10px 20px",
                    cursor: "pointer",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>Already Have An Account</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Email
                </Typography>
                <TextField
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  value={email}
                  fullWidth
                  size="small"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Password
                </Typography>
                <TextField
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 2,
                backgroundColor: "#fff",
                p: 4,
                borderRadius: 4,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Box
                  onClick={() => setAlreadyHaveAccount(false)}
                  sx={{
                    borderRadius: "20px",
                    border: `2px solid ${alreadyHaveAccount ? "#ddd" : "orange"}`,
                    padding: "10px 20px",
                    cursor: "pointer",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>I'm New Here</Typography>
                </Box>
                <Box
                  onClick={() => setAlreadyHaveAccount(true)}
                  sx={{
                    borderRadius: "20px",
                    border: `2px solid ${alreadyHaveAccount ? "orange" : "#ddd"}`,
                    padding: "10px 20px",
                    cursor: "pointer",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>Already Have An Account</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Full Name
                </Typography>
               <TextField
      value={fullName}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value)) { // Only letters and spaces allowed
          setFullName(value);
          setErrors((prev) => ({ ...prev, fullName: "" }));
        }
      }}
      fullWidth
      size="small"
      type="text"
      placeholder="Enter full name"
      error={!!errors.fullName}
      helperText={errors.fullName}
      inputProps={{
        pattern: "[A-Za-z\\s]*", // Enforce letters and spaces at HTML level
        inputMode: "text", // Optimize for text input
      }}
      sx={{
        backgroundColor: "#f9f9f9",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      }}
    />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Email
                </Typography>
                <TextField
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  value={email}
                  fullWidth
                  size="small"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Phone
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    select
                    size="small"
                    defaultValue="+1"
                    sx={{
                      width: "150px",
                      backgroundColor: "#f9f9f9",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                    SelectProps={{
                      renderValue: (value) => value,
                    }}
                  >
                    {countries.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <img
                            src={`https://flagcdn.com/w40/${option.flag}.png`}
                            alt={option.country}
                            width="20"
                            height="15"
                            style={{ borderRadius: "3px" }}
                          />
                          {option.country} ({option.code})
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                 <TextField
  fullWidth
  size="small"
  type="number"
  value={phoneNumber}
  onChange={(e) => {
    if(e.target.value.toString().length<=11)
    {
      setPhoneNumber(e.target.value);

    }
    
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  }}
  placeholder="Enter phone number"
  error={!!errors.phoneNumber}
  helperText={errors.phoneNumber}
  inputProps={{
    maxLength: 11, // Limits input to 11 digits
  }}
  sx={{
    backgroundColor: "#f9f9f9",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  }}
/>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  size="small"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  size="small"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              p: 4,
              mb: { md: -4 },
              borderRadius: 4,
              width: "100%",
              maxWidth: "400px",
              alignSelf: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2 }}>
              Summary
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography>Paper</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{typeOfPaper || "Not selected"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Academic Level</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{academicLevel || "Not selected"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>No Of Pages</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{quantity || "Not set"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Deadline</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {deadline
                    ? new Date(deadline).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) +
                      " " +
                      new Date(deadline).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Not set"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Total</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
                  ${studentPrice.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>

            <Button
              onClick={handleNextClick}
              disabled={loading}
              sx={{
                backgroundColor: "#ff7a00",
                color: "#000",
                fontWeight: "bold",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 1,
                mt: 2,
                px: 3,
                "&:disabled": {
                  backgroundColor: "#ccc",
                  color: "#666",
                },
              }}
            >
              Next <ArrowForwardIcon />
            </Button>

            <Box sx={{ mt: 3 }}>
              {questionsAndAnswers.map((item, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    boxShadow: "none",
                    mb: 2,
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAccordionSummary-content": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        mr: 2,
                      }}
                    >
                      {index === 0 && <GavelIcon sx={{ color: "#000" }} />}
                      {index === 1 && <AttachMoneyIcon sx={{ color: "#000" }} />}
                      {index === 2 && <LockIcon sx={{ color: "#000" }} />}
                    </Box>
                    <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: "#555" }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PlaceOrderStep2;