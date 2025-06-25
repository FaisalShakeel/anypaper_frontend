import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";

const faqs = [
  {
    question: "Will the writers follow the guidelines specified in the order?",
    answer:
      "Yes, our writers will follow the guidelines you provide. However, it's important that you provide clear, detailed instructions in your order. We encourage open communication between you and the writer to ensure all your requirements are fully understood. Feel free to reach out to the writer during the process if you have any questions or updates. This will help us deliver the best possible result tailored to your needs.",
  },
  {
    question: "How can I be sure that your service provides original content?",
    answer:
      "We prioritize originality in all our work. Each paper is written from scratch, tailored to your specific instructions. To ensure there is no plagiarism, we conduct thorough checks before delivery. Additionally, we offer a free originality report with every order, so you can verify that your paper meets a high standard of uniqueness, with a score of 96% or higher.",
  },
  {
    question:
      "Can I make changes or provide additional instructions after placing my order?",
    answer:
      "Yes, you can! We want to ensure your paper fully meets your needs. Even after the writer is assigned and your order is marked as 'In Progress,' you're welcome to update or add any new details. Simply log in to your account, select your order, and click 'View Details.' From there, you can edit the description, add new instructions, or upload any additional files. You can also leave comments or request revisions at any time. Our goal is to ensure you're completely satisfied with your paper!",
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer:
      "Yes! We stand behind the quality of our service. If you are not satisfied with your order for any reason, you can request a refund based on our refund policy. Our customer support team will assess your case and ensure that you receive fair compensation if the work does not meet your expectations.",
  },
  {
    question: "Can I request post-delivery edits?",
    answer:
      "Yes, you can request unlimited edits within 14 days after the delivery of your order. We want to ensure you're completely satisfied with the final result, so feel free to reach out with any changes or revisions you'd like. Simply contact us within the 14-day period, and our team will assist you with the necessary updates.",
  },
  {
    question: "What is your revision policy?",
    answer:
      "We offer a flexible revision policy. If your requirements are not met, you can request free edits within the first 14 days after order completion. Our goal is to ensure that the final product aligns with your expectations.",
  },
];

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        background:
          "radial-gradient(ellipse at center, #C4E0DF 0%, #D9EFEE 50%, #F0FAFA 85%, #FAFCFF 100%)",
        px: "3vw",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#0B3953",
          mb: 4,
          fontFamily: "raleway,sans-serif",
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, md: 1 },
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {faqs.map((faq, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  p: 0,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    p: 2,
                  }}
                  onClick={() => handleToggle(index)}
                >
                  <IconButton sx={{mr: 4}}>
                    {expandedIndex === index ? (
                      <Remove sx={{ color: "orange" }} />
                    ) : (
                      <Add />
                    )}
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1B1139",
                      flex: 1,
                      textAlign: "start",
                      fontFamily: "Inter,sans-serif",
                      overflow: "hidden",
                      fontSize: { xs: "10px", md: "12px", lg: "14px" },
                    }}
                  >
                    {faq.question}
                  </Typography>
                </CardContent>
                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent sx={{ textAlign: "left", p: 2, ml:9 }}>
                    <Typography
                    sx={{
                      mt:-2,
                      fontSize: "14px",
                      color: "#000",
                      fontWeight: 400,
                      fontFamily: "raleway, sans-serif",
                      maxWidth: "80%",}}
                    >
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
