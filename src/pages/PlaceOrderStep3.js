import { Typography,TextField,Snackbar,Alert,Box,Button,MenuItem,Stepper,Step,StepLabel,Radio,FormControlLabel,Grid, CircularProgress } from "@mui/material"
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
import { StudentPriceCalculationContext } from "../contexts/StudentPriceCalculationContext";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
function PlaceOrderStep3(){
  const {user} = useContext(AuthContext)
  const{fieldOfStudy,typeOfPaper,academicLevel,deadline,studentPrice,writerPrice,quantity,specificRequirements,placeOrder,loading,message,severity,isOrderSnackbarOpen,setIsOrderSnackbarOpen,referenceStyle,noOfSources,otherInstructions,setHasPaidForOrder}=useOrderContext()
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return; // Prevent close on click away
    setIsOrderSnackbarOpen(false);
  };
    const navigate=useNavigate()
    const steps = [
        "Subject Information",
        "Account",
        "Payment",
        "Order in Progress",
      ];
      // useEffect(()=>{
      //   if(!typeOfPaper || !fieldOfStudy || !deadline || !academicLevel || !specificRequirements || !quantity || !noOfSources || !referenceStyle || !user)
      //   {
      //     navigate(-1)
      //   }
      // },[])
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
       <CustomStepper steps={steps} activeStep={3}/>

        <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Form Section */}
        <Box
          sx={{
            flex: 2,
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Paper effect
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {/* Payment Type */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: "#000",
                mb: 2,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              How would you like to pay?
            </Typography>
      
            {/* Radio buttons for payment method */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <FormControlLabel
                value="Credit"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff7a00",
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      padding: "8px 15px",
                      borderRadius: "4px",
                      border: "2px solid #ccc",
                      backgroundColor: "#fff",
                      "&.Mui-checked": {
                        borderColor: "#ff7a00",
                      },
                    }}
                  >
                    <CreditCardIcon sx={{ color: "#ff7a00" }} />
                    Credit
                  </Box>
                }
              />
              <FormControlLabel
                value="Other"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff7a00",
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      padding: "8px 15px",
                      borderRadius: "4px",
                      border: "2px solid #ccc",
                      backgroundColor: "#fff",
                      "&.Mui-checked": {
                        borderColor: "#ff7a00",
                      },
                    }}
                  >
                    <OtherHousesIcon sx={{ color: "#ff7a00" }} />
                    Other
                  </Box>
                }
              />
            </Box>
          </Box>
      
          {/* Payment Icons */}
          <Box sx={{ mb: 3, display: "flex", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "8px 15px",
                border: "2px solid #ccc",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#ff7a00",
                },
                "&.Mui-checked": {
                  borderColor: "#ff7a00",
                },
              }}
            >
              <VisaIcon sx={{ color: "#0070ba" }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "8px 15px",
                border: "2px solid #ccc",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#ff7a00",
                },
                "&.Mui-checked": {
                  borderColor: "#ff7a00",
                },
              }}
            >
              <PayPalIcon sx={{ color: "#009cde" }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: "8px 15px",
                border: "2px solid #ccc",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#ff7a00",
                },
                "&.Mui-checked": {
                  borderColor: "#ff7a00",
                },
              }}
            >
              <SolidGateIcon sx={{ color: "#34495e" }} />
            </Box>
          </Box>
      
          {/* Card Details */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Card Number</Typography>
            <TextField
              fullWidth
              size="small"
              sx={{
                backgroundColor: "#f9f9f9",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ width: "50%" }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>Expiration</Typography>
              <TextField
                fullWidth
                size="small"
                sx={{
                  backgroundColor: "#f9f9f9",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>CVC</Typography>
              <TextField
                fullWidth
                size="small"
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
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Country</Typography>
            <TextField
              fullWidth
              size="small"
              sx={{
                backgroundColor: "#f9f9f9",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </Box>
      
        {/* Summary Section */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            p: 4,
            borderRadius: 4,
            width: "100%",
            maxWidth: "400px",
            alignSelf: { xs: "center", md: "flex-start" }, // Ensures it starts at the top
          }}
        >
          {/* Summary Title */}
          <Typography
            sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2, textAlign: "left" }}
          >
            Summary
          </Typography>
      
          {/* Summary Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography>Paper</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Essay</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>No Of Pages</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>2</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Deadline</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>2024-12-01</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Academic Level</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Undergraduate</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Total</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: "bold", color: "black" }}>${studentPrice.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          <Snackbar
        open={isOrderSnackbarOpen}
        autoHideDuration={1000} // Automatically hides after 3 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
          {/* Button */}
          <Button
            fullWidth
            onClick={async()=>{
              console.log("No Of Sources In step3",noOfSources)
              console.log("Requirements",specificRequirements)
             const statusCode= await placeOrder(fieldOfStudy,typeOfPaper,academicLevel,deadline,quantity,specificRequirements,noOfSources,referenceStyle,otherInstructions,studentPrice,writerPrice)
             if(statusCode==201)
             {
              setHasPaidForOrder(true)
              setTimeout(()=>{
              navigate("/student/placeorder/step/4")
              setIsOrderSnackbarOpen(false)


              },1000)
             }

            }}
            sx={{
              backgroundColor: "#ff7a00",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              mt: 2,
              px: 4,
            }}
          >
            {
              loading?<CircularProgress sx={{color:"white",height:"20px",width:"20px"}} thickness={7}/>:<>
            Proceed to Checkout <ArrowForwardIcon />

              </>
            }
          </Button>
        </Box>
      </Box>
      </Box>
      </Box>
      
      
    )
}
export default PlaceOrderStep3