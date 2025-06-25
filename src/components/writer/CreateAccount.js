import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Autocomplete,
  IconButton,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { fieldsOfStudy } from "../../constants/FieldsOfStudy";

const SignUpWriter = () => {
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [expertise, setExpertise] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableOptions] = useState(fieldsOfStudy);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+1", label: "US (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+91", label: "India (+91)" },
    { code: "+86", label: "China (+86)" },
    { code: "+61", label: "Australia (+61)" },
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (!phoneNumber.trim()) newErrors.phoneNumber = true;
    if (yearsOfExperience === "" || yearsOfExperience < 0) newErrors.yearsOfExperience = true;
    if (expertiseList.length === 0) newErrors.expertise = true;
    if (files.length === 0) newErrors.files = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleAddExpertise = (event) => {
    if (
      event.key === "Enter" &&
      expertise.trim() &&
      !expertiseList.includes(expertise)
    ) {
      setExpertiseList([...expertiseList, expertise.trim()]);
      setExpertise("");
      setErrors((prev) => ({ ...prev, expertise: false }));
    }
  };

  const handleDeleteExpertise = (item) => {
    const newList = expertiseList.filter((exp) => exp !== item);
    setExpertiseList(newList);
    if (newList.length === 0) {
      setErrors((prev) => ({ ...prev, expertise: true }));
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setErrors((prev) => ({ ...prev, files: false }));
  };

  const handleRemoveFile = (fileName) => {
    const newFiles = files.filter((file) => file.name !== fileName);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setErrors((prev) => ({ ...prev, files: true }));
    }
  };

  const createAccount = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", `${countryCode}${phoneNumber}`);
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("writingExpertise", JSON.stringify(expertiseList));
    files.forEach((file) => {
      formData.append("portfolio", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_WRITER_SIGN_UP}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Account Created Successfully!");
        setUser(response.data.writer);
        setTimeout(() => {
          navigate("/writer/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "100%", md: "90%" },
        mt: -2,
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 0,
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          width: { xs: "95%", sm: "90%", md: "85%" },
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: "50px",
          transform: "translateY(-30px)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ color: "black" }}
        >
          Create Your Writer Account
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "black", opacity: 0.7 }}
        >
          Connect, Collaborate And Stay Organized.
        </Typography>

        {/* Input Fields */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Name:<span style={{ color: "red" }}> *</span>
            </Typography>
            <TextField
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: !e.target.value.trim() }));
              }}
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              sx={{ marginTop: 1 }}
              InputProps={{
                sx: { height: 40 },
              }}
              error={errors.name}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Email:<span style={{ color: "red" }}> *</span>
            </Typography>
            <TextField
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: !e.target.value.trim() }));
              }}
              fullWidth
              variant="outlined"
              placeholder="Enter Email"
              sx={{ marginTop: 1 }}
              InputProps={{
                sx: { height: 40 },
              }}
              error={errors.email}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, mt: { xs: 1, md: 0 } }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Password:<span style={{ color: "red" }}> *</span>
            </Typography>
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: !e.target.value.trim() }));
              }}
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              sx={{ marginTop: 1 }}
              InputProps={{
                sx: { height: 40 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={errors.password}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Phone Number:<span style={{ color: "red" }}> *</span>
            </Typography>
            <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
              <FormControl sx={{ width: "30%" }}>
                <InputLabel>Code</InputLabel>
                <Select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  label="Code"
                  sx={{ height: 40 }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 15);
                  setPhoneNumber(value);
                  setErrors((prev) => ({ ...prev, phoneNumber: !value.trim() }));
                }}
                value={phoneNumber}
                fullWidth
                variant="outlined"
                placeholder="Enter Phone Number"
                sx={{ flex: 1 }}
                InputProps={{
                  sx: { height: 40 },
                }}
                error={errors.phoneNumber}
                inputProps={{ maxLength: 15 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Expertise and Experience */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Writing Expertise:<span style={{ color: "red" }}> *</span>
            </Typography>
            <Autocomplete
              freeSolo
              options={availableOptions}
              inputValue={expertise}
              onInputChange={(event, newInputValue) =>
                setExpertise(newInputValue)
              }
              onKeyDown={handleAddExpertise}
              sx={{
                marginTop: 1,
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Type expertise and press Enter"
                  error={errors.expertise}
                />
              )}
            />
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {expertiseList.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteExpertise(item)}
                  sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Years Of Experience:<span style={{ color: "red" }}> *</span>
            </Typography>
            <TextField
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
                  setYearsOfExperience(value);
                  setErrors((prev) => ({ ...prev, yearsOfExperience: value === "" }));
                }
              }}
              value={yearsOfExperience}
              type="number"
              variant="outlined"
              placeholder="Years"
              fullWidth
              sx={{ marginTop: 1, height: 40 }}
              inputProps={{ style: { height: 10 }, min: 0 }}
              error={errors.yearsOfExperience}
            />
          </Box>
        </Box>

        {/* Portfolio */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ color: "black" }}
          >
            Portfolio<span style={{ color: "red" }}> *</span>
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", marginTop: 1, color: errors.files ? "red" : "gray" }}
          >
            Upload portfolio or work samples:
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#376E70",
              color: "white",
              ":hover": { backgroundColor: "#2D5656" },
              marginTop: 1,
              width: { xs: "50%", md: "17%" },
            }}
          >
            Browse Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </Button>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 1,
                  border: `1px solid ${errors.files ? "#f44336" : "#e0e0e0"}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "black" }}>
                  {file.name}
                </Typography>
                <Button
                  onClick={() => handleRemoveFile(file.name)}
                  sx={{ color: "orange" }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sign Up Button */}
        <Button
          onClick={createAccount}
          disabled={loading}
          variant="contained"
          sx={{
            width: { xs: "90%", md: "50%" },
            backgroundColor: "#2D5656",
            color: "white",
            padding: "8px 16px",
            ":hover": { backgroundColor: "#1C3E3E" },
            alignSelf: "center",
          }}
        >
          {loading ? (
            <CircularProgress
              sx={{ height: "15px !important", width: "15px !important", color: "white" }}
            />
          ) : (
            "Sign Up"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpWriter;
