// import { Box,Typography,Button } from "@mui/material";
// import styled from "styled-components" 
//  function OfferSection(){
//     const SectionWrapper = styled(Box)({
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#f0f8ff", // Light skyblue background color
//         padding: "40px",
//         borderRadius: "8px",
//         position: "relative",
//         overflow: "hidden", // Ensures the image can "cross" outside the section
//       });
      
//       const TextWrapper = styled(Box)({
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         width: "50%", // Taking up half the space
//         paddingRight: "20px",
//       });
      
     
      
//       const ImageWrapper = styled(Box)({
//         width: "50%", // Taking up half the space
//         position: "absolute", // Absolute positioning to make it "cross" the box
//         right: 0,
//         bottom: "-20px", // Slightly below the section
//         zIndex: -1, // Make sure the image is behind the text
//         transform: "scale(1.2)", // Slightly zoomed in for the crossing effect
//       });
//     return(
//         <SectionWrapper>
//       {/* Left Side - Text Section */}
//       <TextWrapper>
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#000",
//             marginBottom: 2,
//           }}
//         >
//           Let's Get Started
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "1rem",
//             color: "#555",
//             marginBottom: 3,
//           }}
//         >
//           Get 15% off on your first order.<br></br> Start your journey with us today and enjoy amazing discounts!
//         </Typography>

//         <Button
//     sx={{
//       mt: 4, // Margin top for spacing
//       padding: "12px 30px", // Padding for the button
//       backgroundColor: "#FFA500", // Orange background color
//       color: "#000", // Black text
//       fontWeight: "bold", // Bold text
//       borderRadius: "30px", // Rounded corners
//       textTransform: "none", // Prevent text transformation
//       "&:hover": {
//         backgroundColor: "#e68900", // Slightly darker orange on hover
//       },
//     }}
//   >
//     Claim Now
//   </Button>
//       </TextWrapper>

//       {/* Right Side - Image Section */}
//       <ImageWrapper>
//         {/* Add your image here */}
//         <img
//           src="/path-to-your-image.jpg" // Replace with your image path
//           alt="Promotional Image"
//           width={500} // Image width
//           height={500} // Image height
//         />
//       </ImageWrapper>
//     </SectionWrapper>
//     )
// }
// export default OfferSection