import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast,ToastContainer } from "react-toastify";
import { useOrderContext } from "./OrderContext";
import { AuthContext } from "./AuthContext";

// Create the context
export const StudentSignUpLoginContext = createContext();
export const useStudentSignUpLoginContext=()=>{
   return(useContext(StudentSignUpLoginContext))
}

// Context provider
export const StudentSignUpLoginProvider = ({ children }) => {
  const{setUser}=useContext(AuthContext)
  
  
  const [fullName, setFullName] = useState(""); // Store student details
  
  const[email,setEmail]=useState("")
  const[phoneNumber,setPhoneNumber]=useState("")
  const[academicLevel,setAcademicLevel]=useState("")
  const[password,setPassword]=useState("")
  const[confirmPassword,setConfirmPassword]=useState("")
  const[alreadyHaveAccount,setAlreadyHaveAccount]=useState(false)
  const[loading,setLoading]=useState(false)
  const[open,setOpen]=useState(false)
  const[message,setMessage]=useState("")
  const[severity,setSeverity]=useState("")
  // Function to handle login
  const login = async (email, password) => {
    console.log("Base Url");
    console.log(process.env.STUDENT_LOGIN);
  
    let statusCode = 404; // Default status code
    setLoading(true);
  
    // Field Validation
    if (!email || !password) {
      setOpen(true);
      setMessage("Please provide both email and password.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Return early without making the API call
    }
  
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_STUDENT_LOGIN}`,
        { email, password },
        { withCredentials: true }
      );
  
      statusCode = response.status;
  
      if (response.status === 200) {
        setUser(response.data.student)
        setOpen(true);
        setMessage(response.data.message);
        setSeverity("success");
      }
    } catch (e) {
      setOpen(true);
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  
    return statusCode;
  };
  
  const createAccount = async (fullName, email, phoneNumber, password, confirmPassword) => {
    console.log("Base Url");
    console.log(process.env.REACT_APP_STUDENT_SIGN_UP);
    let statusCode = 404; // Default status code
    setLoading(true);
  
    // Field Validation
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setOpen(true);
      setMessage("All fields are required. Please fill in all fields.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Return early without making the API call
    }
  
    if (password !== confirmPassword) {
      setOpen(true);
      setMessage("Passwords do not match. Please try again.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Return early without making the API call
    }
  
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_STUDENT_SIGN_UP}`,
        { fullName, email, phoneNumber, password, confirmPassword },
        { withCredentials: true } // Include cookies in the request
      );
  
      statusCode = response.status;
      console.log("Response", response.data);
  
      if (response.status === 201) {
        setUser(response.data.student)
        setOpen(true);
        setMessage(response.data.message);
        setSeverity("success");
      }
    } catch (e) {
      console.log("Error Msg while creating account", e);
      setSeverity("error");
      setMessage(e.response ? e.response.data.message : e.message);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  
    return statusCode;
  };
  



  return (
    <StudentSignUpLoginContext.Provider
      value={{ fullName,setFullName,email,setEmail,academicLevel,setAcademicLevel,phoneNumber,setPhoneNumber,password,setPassword,confirmPassword,setConfirmPassword,alreadyHaveAccount,setAlreadyHaveAccount ,createAccount,login,loading,setLoading,message,setMessage,open,setOpen,severity,setSeverity}}
    >
      {children}
    </StudentSignUpLoginContext.Provider>
  );
};


