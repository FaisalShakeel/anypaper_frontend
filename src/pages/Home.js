import { Box } from "@mui/material";
import HeroSection from "../components/landingpage/herosection";
import Statistics from "../components/landingpage/statistics";
import Features from "../components/landingpage/features";

import Reviews from "../components/landingpage/reviews";
import FAQ from "../components/landingpage/FAQ";
import Footer from "../components/landingpage/footer";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
const Home = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(()=>{
    if(user){
      if(user.role=="Writer")
      {
        navigate("/writer/dashboard")
      }
    }
  },[user])
  return (
    <Box sx={{ backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif" }}>
      <HeroSection />
      <Statistics />

      <Features />
      <Reviews />
      <FAQ />
      <Footer />
    </Box>
  );
};

export default Home;
