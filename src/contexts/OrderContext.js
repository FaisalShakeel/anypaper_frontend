import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver"; // Optional: For downloading the zip file

// Create OrderContext
const OrderContext = createContext();

// Custom hook to use OrderContext
export const useOrderContext = () => {
  return useContext(OrderContext);
};

// Provider Component
export const OrderProvider = ({ children }) => {
  const [typeOfPaper, setTypeOfPaper] = useState("Lab Work"); // Manage order data here
  const [fieldOfStudy, setFieldOfStudy] = useState("Anthropology");
  const [academicLevel, setAcademicLevel] = useState("HighSchool");
  const [deadline, setDeadline] = useState(new Date());
  const [specificRequirements, setSpecificRequirements] = useState("");
  const [otherInstructions, setOtherInstructions] = useState("");
  const [studentPrice, setStudentPrice] = useState(0);
  const [writerPrice, setWriterPrice] = useState(0);

  const [files, setFiles] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOrderSnackbarOpen, setIsOrderSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [orderId, setOrderId] = useState("");
  const [noOfSources, setNoOfSources] = useState(1);
  const [referenceStyle, setReferenceStyle] = useState("APA");
  const [isPostNewOrderButtonActive, setIsPostNewOrderButtonActive] = useState(false);
  const [orders, setOrders] = useState({});
  const [hasPaidForOrder ,setHasPaidForOrder]  = useState(false)

  const placeOrder = async (
    fieldOfStudy,
    typeOfPaper,
    academicLevel,
    deadline,
    quantity,
    specialRequirements,
    noOfSources,
    referenceStyle,
    otherInstructions,
    studentPrice,
    writerPrice
  ) => {
    console.log("Field Of Study",fieldOfStudy)

    setLoading(true);
    let statusCode = 404; // Default status code

    // Field Validation
    if (!fieldOfStudy) {
      setIsOrderSnackbarOpen(true);
      setMessage("Field of Study is required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

    if (!typeOfPaper) {
      setIsOrderSnackbarOpen(true);
      setMessage("Type of Paper is required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

    if (!academicLevel) {
      setIsOrderSnackbarOpen(true);
      setMessage("Academic Level is required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

    if (!deadline) {
      setIsOrderSnackbarOpen(true);
      setMessage("Deadline is required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

    if (!quantity) {
      setIsOrderSnackbarOpen(true);
      setMessage("Quantity is required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

    if (!specificRequirements) {
      setIsOrderSnackbarOpen(true);
      setMessage("Special Requirements are required.");
      setSeverity("error");
      setLoading(false);
      return statusCode; // Exit early
    }

   

    try {
      const formData = new FormData();

      // Append non-file fields to FormData
      formData.append("fieldOfStudy", fieldOfStudy);
      formData.append("typeOfPaper", typeOfPaper);
      formData.append("academicLevel", academicLevel);
      formData.append("deadline", deadline);
      formData.append("quantity", quantity);
      formData.append("specialRequirements", specialRequirements);
      formData.append("referenceStyle", referenceStyle);
      formData.append("noOfSources", noOfSources);
      formData.append("otherInstructions", otherInstructions);
      formData.append("studentPrice", studentPrice);
      formData.append("writerPrice", writerPrice);

      // If files are present, create a zip file and append it to FormData
      if (files.length > 0) {
        const zip = new JSZip();

        // Add each file to the zip
        files.forEach((file) => {
          zip.file(file.name, file);
        });

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: "blob" });
        formData.append("materialFile", zipContent, "archive.zip");
      }

      // Send the FormData to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_CREATE_ORDER}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      statusCode = response.status;

      if (response.status === 201) {
        setOrderId(response.data.order._id);
        setIsOrderSnackbarOpen(true);
        setMessage(response.data.message);
        setSeverity("success");
      }
    } catch (e) {
      setIsOrderSnackbarOpen(true);
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
    } finally {
      setLoading(false);
    }

    return statusCode;
  };

  const getAllOrders = async () => {
    // REACT_APP_BACKEND_BASE_URL/orders/all-orders
    console.log("Get ALL Orders", process.env.GET_ALL_ORDERS);
    try {
      const response = await axios.get(`${process.env.REACT_APP_GET_ALL_ORDERS}`, {
        withCredentials: true,
      });
      console.log("All orders", response.data.orders);
      if (response.data.success) {
        setOrders(response.data.orders.totalOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response ? e.response.data.message : e.message);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        typeOfPaper,
        setTypeOfPaper,
        fieldOfStudy,
        setFieldOfStudy,
        academicLevel,
        setAcademicLevel,
        deadline,
        setDeadline,
        files,
        setFiles,
        specificRequirements,
        setSpecificRequirements,
        otherInstructions,
        setOtherInstructions,
        quantity,
        setQuantity,
        placeOrder,
        loading,
        setLoading,
        isOrderSnackbarOpen,
        setIsOrderSnackbarOpen,
        message,
        setMessage,
        severity,
        setSeverity,
        orderId,
        referenceStyle,
        setReferenceStyle,
        noOfSources,
        setNoOfSources,
        orders,
        setOrders,
        studentPrice,
        setStudentPrice,
        writerPrice,
        setWriterPrice,
        isPostNewOrderButtonActive,
        setIsPostNewOrderButtonActive,
        hasPaidForOrder,
        setHasPaidForOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};