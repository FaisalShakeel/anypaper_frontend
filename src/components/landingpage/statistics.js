import { Box, Typography } from "@mui/material";

function Statistics() {
  return (
    <Box
      sx={{
        mt: 4,
        px: 4,
        py: 2, // Reduced padding on the y-axis to move content upwards
        //backgroundColor: "#fff",
        backgroundImage: "./Group 1000002608.png",
        backgroundSize: "cover",
        backgroundPosition: { xs: "center", sm: "center", md: "center" },
        backgroundRepeat: "no-repeat",
        display: "grid",
        gap: { sm: 1, md: 2 }, // Reduced gap between items
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        textAlign: "center",
      }}
    >
      {[
        { value: "13", label: "Years Experience" },
        { value: "60K", label: "Order completed" },
        { value: "100%", label: "Human Written Content" },
        { value: "500", label: "Professional team" },
      ].map((stat, index) => (
        <Box key={index}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#000",
              fontSize: { xs: "22px", sm: "35px" },
            }}
          >
            {stat.value}
            {stat.value !== "100%" && ( // Conditional rendering for the '+' text
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: "#FCA703",
                  fontSize: { xs: "0.6rem", sm: "1rem", md: "1.5rem" },
                  ml: 1,
                  position: "relative", // Adjusting position
                  top: "-6px", // Move upwards
                }}
              >
                +
              </Typography>
            )}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#000",
              fontSize: { xs: "0.5rem", sm: "0.9rem", md: "1.3rem" },
            }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default Statistics;
