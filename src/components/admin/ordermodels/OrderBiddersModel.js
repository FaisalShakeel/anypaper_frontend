import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Avatar,
  Button,
  Radio,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { toast } from "react-toastify";

const OrderBiddersModel = ({ open, onClose,order }) => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const[isAssigningWriter,setIsAssigningWriter]=useState(false)
  console.log("Order Details",order)
  const orderDetails = {
    id: order._id.toString(),
    title: order.typeOfPaper,
    deadline: order.deadline,
      status:order.status
  };

   const bidders = order.bidders 
  const handleBidderSelection = (id) => {
    setSelectedBidder(id);
  };
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  }
  const assignWriter=async()=>{
    if(order.writerId)
    {
      toast.error("Order Already Assigned!")
      return ;

    }
    setIsAssigningWriter(true)
    try{
      const response=await axios.put(`${process.env.REACT_APP_ASSIGN_WRITER}/${order._id}`,{writerId:selectedBidder},{withCredentials:true})
      if(response.data.success){
        toast.success("Writer Assigned Successfully!")
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch(e){
      toast.error(e.response?e.response.data.message:e.message)

    }
    finally{
      setIsAssigningWriter(false)
      setTimeout(()=>{
      onClose()
      },1000)
    
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="order-bidders-modal"
      aria-describedby="order-bidders-list"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          borderRadius: 3,
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Status Chip */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            px: 2,
            py: 0.5,
            borderRadius: "12px",
            bgcolor: "rgba(255, 192, 203, 0.2)", // Light pink
            boxShadow: "0 2px 6px rgba(255, 182, 193, 0.5)", // Light shadow
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "black",
            }}
          >
              {orderDetails.status}
          </Typography>
        </Box>

        {/* Order Details */}
        <Box sx={{ mt: 4,display:"flex",flexDirection:"row",gap:4 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              mb: 1,
            }}
          >
            Order ID: <span style={{ fontWeight: "400" }}>{orderDetails.id}</span>
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            Order Title: <span style={{ fontWeight: "400" }}>{orderDetails.title}</span>
          </Typography>
          
        </Box>
        <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              mt: 1,
            }}
          >
            Deadline: <span style={{ fontWeight: "400" }}>{formatDate(orderDetails.deadline)}</span>
          </Typography>

        {/* Bidders List */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            mt: 2,
          }}
        >
          Bidders List
        </Typography>

        {/* Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bidders.map((bidder) => (
            <Box
              key={bidder.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                boxShadow:
                  selectedBidder === bidder._id
                    ? "0 0 0 1px orange"
                    : "0 1px 1px rgba(0, 0, 0, 0.1)",
                bgcolor: "white",
                cursor: "pointer",
                "&:hover": { boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" },
                transition: "box-shadow 0.2s",
              }}
              onClick={() => handleBidderSelection(bidder._id)}
            >
              <Radio
                checked={selectedBidder === bidder._id}
                sx={{
                  color: "orange",
                  "&.Mui-checked": { color: "orange" },
                  mr: 2,
                }}
              />
              <Avatar
                src={bidder.avatar}
                alt={bidder.name}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    mb: 0.5,
                  }}
                >
                  {bidder._id}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "0.8rem",
                    color: "text.secondary",
                  }}
                >
                  {bidder.writingExpertise[0]}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarIcon sx={{ color: "orange", fontSize: 16, mr: 0.5 }} />
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "0.8rem",
                  }}
                >
                  {bidder.rating}
                </Typography>
              </Box>
              <ArrowForwardIosIcon
                sx={{ fontSize: 16, color: "gray", ml: 2 }}
              />
            </Box>
          ))}
        </Box>
<Box>
        {/* Close Button */}
        <Button
  onClick={onClose}
  variant="contained"
  sx={{
    mt: 3,
    ml: "auto",
    display: "block", // Ensures proper alignment
    bgcolor: "orange",
    color: "white",
    
    fontSize: "0.85rem", // Reduced font size
    borderRadius: 2,
    px: 3, // Adjusted padding for smaller size
    py: 0.5,
    "&:hover": { bgcolor: "darkorange" },
  }}
>
  Close
</Button>
   {/* Assign Writer Button */}
  {selectedBidder? <Button
  onClick={assignWriter}
  disabled={isAssigningWriter}
  variant="contained"

  sx={{
    mt: 3,
    ml: "auto",
    display: "block", // Ensures proper alignment
    bgcolor: "orange", 
    color: "white",
    
    fontSize: "0.85rem", // Reduced font size
    borderRadius: 2,
    px: 3, // Adjusted padding for smaller size
    py: 0.5,
    "&:hover": { bgcolor: "darkorange" },
  }}
>
 {isAssigningWriter?"Assigning":"Assign Now"}
</Button>:<></>}
  

</Box>

      </Box>
    </Modal>
  );
};

export default OrderBiddersModel;
