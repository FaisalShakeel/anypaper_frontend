import { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fieldsOfStudy } from "../../constants/FieldsOfStudy";
import { useNavigate } from "react-router";

import { WriterPriceCalculationContext } from "../../contexts/WriterPriceCalculationContext";
import { StudentPriceCalculationContext } from "../../contexts/StudentPriceCalculationContext";
import { useOrderContext } from "../../contexts/OrderContext";

const academicLevels = ["HighSchool", "College", "Bachelor", "Masters", "Phd"];

function PostOrderForm() {
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
    setWriterPrice, writerPrice,
    placeOrder,
    isOrderSnackbarOpen,
    message,
    severity,
    setIsOrderSnackbarOpen,
    loading
  } = useOrderContext();

  const { getPrice, adjustPriceByType, getClosestDeadline } = useContext(StudentPriceCalculationContext);
  const { getPriceForWriter, adjustPriceByTypeForWriter } = useContext(WriterPriceCalculationContext);
  const navigate = useNavigate();
  const typesOfPapers = ["Essay","Report","Term Paper","Assesment","Assignment","Article Review","Business Plan","Calculations","Coursework","Case Study","Lab Work","Summary","Cover Letter Writing","Discussion Post","Disertation","Editing","Formatting","Lab Report","Movie Review","Personal Statement","Multiple Choice Questions","Research Proposal","Resume Writing","Topic Suggestion","Thesis","Rewriting","Scholarship Essay","Statistics Project","Thesis Proposal","Speech","Research Paper"].sort((a, b) => a.localeCompare(b));
  
  const today = new Date().toISOString().slice(0,16);
  const [tempDeadline, setTempDeadline] = useState(deadline);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [touched, setTouched] = useState({
    typeOfPaper: false,
    fieldOfStudy: false,
    academicLevel: false,
    deadline: false,
    specificRequirements: false,
    referenceStyle: false,
    noOfSources: false,
    quantity: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const closedDeadline = getClosestDeadline(deadline);
    const calculatedPriceForStudent = getPrice(academicLevel, closedDeadline);
    const finalPriceForStudent = adjustPriceByType(calculatedPriceForStudent, typeOfPaper, closedDeadline);
    const calculatedPriceForWriter = getPriceForWriter(academicLevel, closedDeadline);
    const finalPriceForWriter = adjustPriceByTypeForWriter(calculatedPriceForWriter, typeOfPaper, closedDeadline);
    setStudentPrice(finalPriceForStudent * quantity);
    setWriterPrice(finalPriceForWriter * quantity);
  }, [deadline, typeOfPaper, academicLevel, fieldOfStudy, quantity]);

  const handleQuantityChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === "") {
      setQuantity("");
      return;
    }
    const value = Number(rawValue);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    }
    setTouched({ ...touched, quantity: true });
  };

  const handleNoOfSourcesChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === "") {
      setNoOfSources("");
      return;
    }
    const value = Number(rawValue);
    if (!isNaN(value) && value > 0) {
      setNoOfSources(value);
    }
  };

  const handleNoOfSourcesBlur = () => {
    if (noOfSources < 1) {
      setNoOfSources(1);
    }
    setTouched({ ...touched, noOfSources: true });
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const requiredFieldsFilled = typeOfPaper && fieldOfStudy && academicLevel && deadline && specificRequirements && referenceStyle && noOfSources && quantity;
    if (requiredFieldsFilled) {
      placeOrder(fieldOfStudy, typeOfPaper, academicLevel, deadline, quantity, specificRequirements, noOfSources, referenceStyle, otherInstructions, studentPrice, writerPrice);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleDeadlineConfirm = () => {
    setDeadline(tempDeadline);
    setIsDatePickerOpen(false);
    setTouched({ ...touched, deadline: true });
  };

  const handleFieldTouch = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const getErrorStyle = (value, isRequired) => {
    if (isRequired && (formSubmitted || touched[value]) && !value) {
      return { borderColor: 'red' };
    }
    return {};
  };

  return (
    <Container maxWidth="lg">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: "900px",
          mx: "auto",
          p: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Post an Order
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Type of Paper: <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={typeOfPaper}
              onChange={(e) => {
                setTypeOfPaper(e.target.value);
                handleFieldTouch('typeOfPaper');
              }}
              required
              sx={getErrorStyle(typeOfPaper, true)}
            >
              {typesOfPapers.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Field of Study: <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={fieldOfStudy}
              onChange={(e) => {
                setFieldOfStudy(e.target.value);
                handleFieldTouch('fieldOfStudy');
              }}
              required
              sx={getErrorStyle(fieldOfStudy, true)}
            >
              {fieldsOfStudy.map((fieldOfStudy) => (
                <MenuItem key={fieldOfStudy} value={fieldOfStudy}>
                  {fieldOfStudy}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Academic Level: <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={academicLevel}
              onChange={(e) => {
                setAcademicLevel(e.target.value);
                handleFieldTouch('academicLevel');
              }}
              required
              sx={getErrorStyle(academicLevel, true)}
            >
              {academicLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Price: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">The budget is automatically adjusted</Typography>
            <Typography variant="h6" fontWeight="bold">
              ${studentPrice.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Description: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">Write description to your order</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="This assignment is about..."
              value={specificRequirements}
              onChange={(e) => {
                setSpecificRequirements(e.target.value);
                handleFieldTouch('specificRequirements');
              }}
              required
              sx={getErrorStyle(specificRequirements, true)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Deadline: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">Set deadline for your order</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TextField
                InputProps={{ inputProps: { min: today } }}
                fullWidth
                type="datetime-local"
                variant="outlined"
                value={tempDeadline}
                onChange={(e) => setTempDeadline(e.target.value)}
                onFocus={() => setIsDatePickerOpen(true)}
                InputLabelProps={{ shrink: true }}
                required
                sx={getErrorStyle(deadline, true)}
              />
              <Button
                variant="contained"
                onClick={handleDeadlineConfirm}
                sx={{
                  bgcolor: "orange",
                  color: "white",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  minWidth: "80px",
                  height: "40px",
                  "&:hover": { bgcolor: "#e59400" }
                }}
              >
                Set
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Other Instructions:
            </Typography>
            <Typography variant="caption" color="gray">Write other instructions to your order</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="write other instructions here..."
              value={otherInstructions}
              onChange={(e) => setOtherInstructions(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Reference Style: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">Set reference style for your order</Typography>
            <TextField
              fullWidth
              select
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setReferenceStyle(e.target.value);
                handleFieldTouch('referenceStyle');
              }}
              value={referenceStyle}
              required
              sx={getErrorStyle(referenceStyle, true)}
            >
              <MenuItem value="APA">APA</MenuItem>
              <MenuItem value="MLA">MLA</MenuItem>
              <MenuItem value="Chicago/Turabian">Chicago/Turabian</MenuItem>
              <MenuItem value="Harvard">Harvard</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              No Of Sources: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">Set no of sources for your order</Typography>
            <TextField
              value={noOfSources}
              onBlur={handleNoOfSourcesBlur}
              onChange={handleNoOfSourcesChange}
              fullWidth
              type="number"
              required
              sx={getErrorStyle(noOfSources, true)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              No of Pages: <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="caption" color="gray">Specify the number of pages for attachment</Typography>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              value={quantity}
              onBlur={handleBlur}
              onChange={handleQuantityChange}
              min="1"
              required
              sx={getErrorStyle(quantity, true)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="black" fontWeight="bold">
              Attachments:
            </Typography>
            <Typography variant="caption" color="gray">Upload files: </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                fullWidth
                component="label"
                startIcon={<AttachFileIcon />}
                sx={{
                  width: { xs: '100%', sm: '200px' },
                  height: "45px",
                  bgcolor: "orange",
                  color: "white",
                }}
              >
                Browse Files
                <input type="file" hidden multiple onChange={handleFileChange} />
              </Button>
            </Box>
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
          </Grid>

          <Grid sx={{ marginLeft: "auto" }} item xs={12} sm={6} display="flex" alignItems="center" justifyContent="flex-end">
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                width: { xs: '100%', sm: '200px' },
                height: "52px",
                bgcolor: "orange",
                color: "white",
                fontWeight: "bold",
                mt: 6,
              }}
            >
              {loading ? "Posting" : "Post Order"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={isOrderSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setIsOrderSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={severity} onClose={() => setIsOrderSnackbarOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PostOrderForm;