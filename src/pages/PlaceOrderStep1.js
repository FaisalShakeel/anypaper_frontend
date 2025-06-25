import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton
} from "@mui/material";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import GavelIcon from "@mui/icons-material/Gavel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LockIcon from "@mui/icons-material/Lock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; 
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NavBar from "../components/landingpage/navbar";
import { useNavigate } from "react-router";
import moment from "moment/moment";
import { useOrderContext } from "../contexts/OrderContext";
import CustomStepper from "../components/customstepper";
import { StudentPriceCalculationContext } from "../contexts/StudentPriceCalculationContext";
import { fieldsOfStudy } from "../constants/FieldsOfStudy";
import { WriterPriceCalculationContext } from "../contexts/WriterPriceCalculationContext";
import { toast, ToastContainer } from "react-toastify";

function PlaceOrder() {
  const {
    typeOfPaper, setTypeOfPaper,
    fieldOfStudy, setFieldOfStudy,
    academicLevel, setAcademicLevel,
    quantity, setQuantity,
    deadline, setDeadline,
    specificRequirements, setSpecificRequirements,
    files, setFiles,
    referenceStyle, setReferenceStyle,
    noOfSources, setNoOfSources,
    otherInstructions, setOtherInstructions,
    studentPrice, setStudentPrice,
    writerPrice, setWriterPrice
  } = useOrderContext();
  const { getPrice, adjustPriceByType, getClosestDeadline } = useContext(StudentPriceCalculationContext);
  const { getPriceForWriter, adjustPriceByTypeForWriter } = useContext(WriterPriceCalculationContext);
  const navigate = useNavigate();

  const typesOfPapers = [
    "Essay", "Report", "Term Paper", "Assesment", "Assignment", "Article Review",
    "Business Plan", "Calculations", "Coursework", "Case Study", "Lab Work",
    "Summary", "Cover Letter Writing", "Discussion Post", "Diserratation",
    "Editing", "Formatting", "Lab Report", "Movie Review", "Personal Statement",
    "Multiple Choice Questions", "Research Proposal", "Resume Writing",
    "Topic Suggestion", "Thesis", "Resume Editing", "Rewriting",
    "Scholarship Essary", "Statistics Project", "Thesis Proposal", "Speech"
  ].sort((a, b) => a.localeCompare(b));

  const today = new Date().toISOString().slice(0, 16);
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState({
    typeOfPaper: "",
    fieldOfStudy: "",
    academicLevel: "",
    quantity: "",
    deadline: "",
    specificRequirements: "",
    noOfSources: "",
    referenceStyle: ""
  });

  useEffect(() => {
    const closedDeadline = getClosestDeadline(deadline);
    const calculatedPriceForStudent = getPrice(academicLevel, closedDeadline);
    const finalPriceForStudent = adjustPriceByType(calculatedPriceForStudent, typeOfPaper, closedDeadline);
    const calculatedPriceForWriter = getPriceForWriter(academicLevel, closedDeadline);
    const finalPriceForWriter = adjustPriceByTypeForWriter(calculatedPriceForWriter, typeOfPaper, closedDeadline);
    setStudentPrice(finalPriceForStudent * (quantity || 1));
    setWriterPrice(finalPriceForWriter * (quantity || 1));

    console.log("Closed Deadline", closedDeadline);
    console.log("Final Price", finalPriceForStudent);
    console.log("Calculated Price", calculatedPriceForStudent);
    console.log("Final Price For Writer", finalPriceForWriter);
    console.log("Calculated Price For Writer", calculatedPriceForWriter);
  }, [deadline, typeOfPaper, academicLevel, fieldOfStudy, quantity]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleQuantityChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === "") {
      setQuantity("");
      setErrors((prev) => ({ ...prev, quantity: "" }));
      return;
    }
    const value = Number(rawValue);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const handleBlur = () => {
    console.log("Handling Quantity");
    if (!quantity || quantity < 1) {
      setQuantity(1);
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const handleNoOfSourcesChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === "") {
      setNoOfSources("");
      setErrors((prev) => ({ ...prev, noOfSources: "" }));
      return;
    }
    const value = Number(rawValue);
    if (!isNaN(value) && value > 0) {
      setNoOfSources(value);
      setErrors((prev) => ({ ...prev, noOfSources: "" }));
    }
  };

  const handleNoOfSourcesBlur = () => {
    if (!noOfSources || noOfSources < 1) {
      setNoOfSources(1);
      setErrors((prev) => ({ ...prev, noOfSources: "" }));
    }
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const validateForm = () => {
    const newErrors = {
      typeOfPaper: "",
      fieldOfStudy: "",
      academicLevel: "",
      quantity: "",
      deadline: "",
      specificRequirements: "",
      noOfSources: "",
      referenceStyle: ""
    };
    let isValid = true;

    if (!typeOfPaper) {
      newErrors.typeOfPaper = "Type of Paper is required";
      isValid = false;
    }
    if (!fieldOfStudy) {
      newErrors.fieldOfStudy = "Field of Study is required";
      isValid = false;
    }
    if (!academicLevel) {
      newErrors.academicLevel = "Academic Level is required";
      isValid = false;
    }
    if (!quantity || quantity < 1) {
      newErrors.quantity = "Number of Pages must be at least 1";
      isValid = false;
    }
    if (!deadline) {
      newErrors.deadline = "Deadline is required";
      isValid = false;
    }
    if (!specificRequirements || specificRequirements.trim().split(/\s+/).length < 3) {
      newErrors.specificRequirements = "Specific Requirements must be at least 3 words";
      isValid = false;
    }
    if (!noOfSources || noOfSources < 1) {
      newErrors.noOfSources = "Number of Sources must be at least 1";
      isValid = false;
    }
    if (!referenceStyle) {
      newErrors.referenceStyle = "Reference Style is required";
      isValid = false;
    }

    setErrors(newErrors);
    if(!isValid){
      toast.error("Please fill the required  fields!")
    }
    return isValid;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      navigate("/student/placeorder/step/2");
    }
  };

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

  const steps = [
    "Subject Information",
    "Account",
    "Payment",
    "Order in Progress",
  ];

  return (
    <Box>
      <NavBar />
      <ToastContainer/>
      
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
        <CustomStepper steps={steps} activeStep={1} />

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
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                Type of Paper
              </Typography>
              <TextField
                fullWidth
                size="small"
                onChange={(e) => {
                  setTypeOfPaper(e.target.value);
                  setErrors((prev) => ({ ...prev, typeOfPaper: "" }));
                }}
                select
                value={typeOfPaper}
                error={!!errors.typeOfPaper}
                helperText={errors.typeOfPaper}
                sx={{
                  backgroundColor: "#f9f9f9",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                {typesOfPapers.map((paper) => (
                  <MenuItem key={paper} value={paper}>{paper}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                Field of Study
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                onChange={(e) => {
                  setFieldOfStudy(e.target.value);
                  setErrors((prev) => ({ ...prev, fieldOfStudy: "" }));
                }}
                value={fieldOfStudy}
                error={!!errors.fieldOfStudy}
                helperText={errors.fieldOfStudy}
                sx={{
                  backgroundColor: "#f9f9f9",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                {fieldsOfStudy.map((field) => (
                  <MenuItem key={field} value={field}>{field}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  Academic Level
                </Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  onChange={(e) => {
                    setAcademicLevel(e.target.value);
                    setErrors((prev) => ({ ...prev, academicLevel: "" }));
                  }}
                  value={academicLevel}
                  error={!!errors.academicLevel}
                  helperText={errors.academicLevel}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="HighSchool">High School</MenuItem>
                  <MenuItem value="College">College</MenuItem>
                  <MenuItem value="Bachelor">Bachelors</MenuItem>
                  <MenuItem value="Masters">Masters</MenuItem>
                  <MenuItem value="Phd">Phd</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                  No Of Pages
                </Typography>
                <TextField
                  value={quantity}
                  onBlur={handleBlur}
                  onChange={handleQuantityChange}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity}
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
              <

Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                Deadline
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                size="small"
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setErrors((prev) => ({ ...prev, deadline: "" }));
                }}
                value={deadline}
                InputProps={{ inputProps: { min: today } }}
                error={!!errors.deadline}
                helperText={errors.deadline}
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
                Describe Your Assignment (Min 3 Words)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={specificRequirements}
                onChange={(e) => {
                  setSpecificRequirements(e.target.value);
                  setErrors((prev) => ({ ...prev, specificRequirements: "" }));
                }}
                size="small"
                error={!!errors.specificRequirements}
                helperText={errors.specificRequirements}
                sx={{
                  backgroundColor: "#f9f9f9",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100px",
                height: "auto",
                border: "2px dashed #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Button
                component="label"
                sx={{
                  color: "#888",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AddIcon sx={{ fontSize: "2rem" }} />
                <Typography>Upload Materials (Optional)</Typography>
                <input hidden type="file" multiple onChange={handleFileChange} />
              </Button>
              {files.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem" }}>
                Other Instructions
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={otherInstructions}
                onChange={(e) => setOtherInstructions(e.target.value)}
                size="small"
                sx={{
                  backgroundColor: "#f9f9f9",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem", fontWeight: "bold" }}>
                  Reference Style
                </Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  onChange={(e) => {
                    setReferenceStyle(e.target.value);
                    setErrors((prev) => ({ ...prev, referenceStyle: "" }));
                  }}
                  value={referenceStyle}
                  error={!!errors.referenceStyle}
                  helperText={errors.referenceStyle}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="APA">APA</MenuItem>
                  <MenuItem value="MLA">MLA</MenuItem>
                  <MenuItem value="Chicago/Turabian">Chicago/Turabian</MenuItem>
                  <MenuItem value="Harvard">Harvard</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: "#000", mb: 1, fontSize: "0.8rem", fontWeight: "bold" }}>
                  No Of Sources
                </Typography>
                <TextField
                  value={noOfSources}
                  onBlur={handleNoOfSourcesBlur}
                  onChange={handleNoOfSourcesChange}
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors.noOfSources}
                  helperText={errors.noOfSources}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              p: 4,
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

export default PlaceOrder;