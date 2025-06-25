import { Typography,TextField,Box,Button,MenuItem,Stepper,Step,StepLabel,Radio,FormControlLabel,Grid } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Circle } from "@mui/icons-material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import VisaIcon from '@mui/icons-material/AccountBalance';
import PayPalIcon from '@mui/icons-material/AccountBalanceWallet';
import SolidGateIcon from '@mui/icons-material/Lock';
import NavBar from "../components/landingpage/navbar";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router";
import { useOrderContext } from "../contexts/OrderContext";
import CustomStepper from "../components/customstepper";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
function PlaceOrderStep4(){
  
  const{orderId,typeOfPaper,fieldOfStudy,academicLevel,specificRequirements,quantity,noOfSources,referenceStyle,hasPaidForOrder,deadline}=useOrderContext()
  const {user} = useContext(AuthContext)
  const navigate=useNavigate()
    const steps = [
        "Subject Information",
        "Account",
        "Payment",
        "Order in Progress",
      ];
      // useEffect(()=>{
      //         if((!typeOfPaper || !fieldOfStudy || !deadline || !academicLevel || !specificRequirements || !quantity || !noOfSources || !referenceStyle || !user) || (hasPaidForOrder))
      //         {
      //           navigate(-1)
      //         }
      //       },[])
    return(
        <Box>
        <NavBar/>
      {/* Main Content */}
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
        <CustomStepper steps={steps} activeStep={4}/>

         <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" }, // Stack vertically on smaller screens and horizontally on larger screens
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Form Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Paper effect
          width: { xs: "100%", lg: "50%" },
          maxWidth: "500px",
        }}
      >
        {/* Payment Processing Headline */}
        <Typography
          sx={{
            color: "#004C6D", // Deep water color
            fontWeight: "bold",
            fontSize: "1.5rem",
            mb: 2,
          }}
        >
          Your Payment Is Being Processed
        </Typography>

        {/* Order Message */}
        <Typography sx={{ color: "#000", fontWeight: "bold", fontSize: "1rem", mb: 2 }}>
          Your Order # {orderId} Is On Its Way
        </Typography>

        {/* Additional Info */}
        <Typography sx={{ color: "#000", fontSize: "0.9rem", mb: 4 }}>
          Now you can manage your orders in the Control Panel.
        </Typography>

        {/* Manage Orders Button */}
        <Button
        onClick={()=>{
          if(user){
            navigate("/student/myorders")
          }
          else{
          navigate("/login")
          }
        }}
          variant="contained"
          sx={{
            backgroundColor: "#ff7a00",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "50px",
            mb: 2,
            width: "100%",
            py: 1.5,
            textTransform: "none", // Remove uppercase styling
          }}
        >
          Manage Orders
        </Button>

        {/* Another Button */}
        <Button
        onClick={()=>{
          navigate("/")
        }}
          variant="outlined"
          sx={{
            borderColor: "#000",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "50px",
            width: "100%",
            py: 1.5,
            textTransform: "none", // Remove uppercase styling
          }}
        >
         Back To Home Page
        </Button>
      </Box>

      {/* Summary Section */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Card effect
          width: { xs: "100%", lg: "50%" },
          maxWidth: "500px",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url('your-image-path.jpg')", // Replace with your desired image URL
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Paper effect
          }}
        />
      </Box>
    </Box>
      </Box>
      </Box>
      
      
    )
}
export default PlaceOrderStep4