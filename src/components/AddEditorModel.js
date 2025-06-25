import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {useEditorContext} from "../contexts/EditorContext";

const AddEditorModel = ({ isAddEditorModelOpen, onClose }) => {
  const{allEditors,setAllEditors}=useEditorContext()
    const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const[password,setPassword]=useState("")
  const[isAddingEditor,setIsAddingEditor]=useState(false)
 //Adding Editor Function
 const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for missing fields
  if (!fullName) {
    toast.error("Full Name is required!");
    return;
  }
  if (!email) {
    toast.error("Email is required!");
    return;
  }
  if (!phoneNumber) {
    toast.error("Phone Number is required!");
    return;
  }
  if(!password){
    toast.error("Password is required!")
    return ;
  }
  if (!gender) {
    toast.error("Gender is required!");
    return;
  }

  setIsAddingEditor(true);
  console.log({ fullName, email, phoneNumber, gender,password });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_ADD_EDITOR}`,
      { fullName, email, phoneNumber, gender,password }
    );
    console.log("Add Editor Response",response.data)

    if (response.data.success) {
        const editor={
            _id:response.data.editor.id
        }
        setAllEditors([...allEditors,editor])
      toast.success("Editor added successfully!");
    } else {
      console.error(response.data)
      toast.error("Failed to add editor. Please try again.");
    }
  } catch (error) {
    console.error(error)
    toast.error("An error occurred while adding the editor.");
  } finally {
    setTimeout(()=>{
      setIsAddingEditor(false);
    onClose(); // Close the popup after submission
    },[1000]
  )
    
  }
};



  return (
    <Dialog
      open={isAddEditorModelOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "white",
          color: "#333",
          borderRadius: "10px",
        },
      }}
    >
      <ToastContainer/>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "orange",
          fontSize: "1.5rem",
        }}
      >
        Add Editor
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
            sx={{
              "& .MuiInputLabel-root": { color: "orange" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9", // Very light gray
                "& fieldset": { borderColor: "#444" }, // Light black border
                "&:hover fieldset": { borderColor: "#444" },
                "&.Mui-focused fieldset": { borderColor: "orange" },
              },
              "& .MuiOutlinedInput-input": { color: "#333" },
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              "& .MuiInputLabel-root": { color: "orange" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#444" },
                "&.Mui-focused fieldset": { borderColor: "orange" },
              },
              "& .MuiOutlinedInput-input": { color: "#333" },
            }}
          />

          <TextField
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
            sx={{
              "& .MuiInputLabel-root": { color: "orange" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#444" },
                "&.Mui-focused fieldset": { borderColor: "orange" },
              },
              "& .MuiOutlinedInput-input": { color: "#333" },
            }}
          />
           <TextField
            label="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              "& .MuiInputLabel-root": { color: "orange" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9f9f9",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#444" },
                "&.Mui-focused fieldset": { borderColor: "orange" },
              },
              "& .MuiOutlinedInput-input": { color: "#333" },
            }}
          />
          <FormControl fullWidth required>
            <InputLabel sx={{ color: "orange" }}>Gender</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              sx={{
                backgroundColor: "#f9f9f9",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#444" },
                  "&.Mui-focused fieldset": { borderColor: "orange" },
                },
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "orange",
            borderColor: "orange",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f9f9f9" },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "orange",
            color: "white",
            "&:hover": { backgroundColor: "#e68a00" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditorModel;
