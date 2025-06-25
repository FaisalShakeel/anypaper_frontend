import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  IconButton,
  Divider,
  Switch,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AddEditorModel from "../AddEditorModel";

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState("Payment Details");
  const [isAddEditorModelOpen, setIsAddEditorModelOpen] = useState(false);
  const handleOpen = () => setIsAddEditorModelOpen(true);
  const handleClose = () => setIsAddEditorModelOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' },
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
        px: { xs: 2, sm: 3 },
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%", lg: "250px" },
          bgcolor: "#f9f9f9",
          boxShadow: { lg: 1 },
          p: { xs: 1, sm: 2 },
          display: "flex",
          flexDirection: { xs: "row", sm: "column", md: "column", lg: "column" },
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 1, sm: 0 },
          borderRight: { lg: "1px solid #ddd" },
          borderBottom: { xs: "1px solid #ddd", sm: "none", md: "none" },
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: { xs: 1, sm: 3 },
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Settings
        </Typography>
        {["Payment Details", "Email Templates", "Editor Limit"].map((option) => (
          <Box
            key={option}
            sx={{
              p: { xs: 1, sm: 1.5 },
              borderRadius: 1,
              bgcolor: selectedOption === option ? "#e6f4ea" : "transparent",
              color: selectedOption === option ? "#000" : "#555",
              fontWeight: selectedOption === option ? "bold" : "normal",
              cursor: "pointer",
              mb: { xs: 0, sm: 1 },
              flex: { xs: "0 0 auto", sm: "none" },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </Box>
        ))}
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3 },
          bgcolor: "#f9f9f9",
          width: { xs: "100%", sm: "100%", md: "100%", lg: "auto" },
          boxSizing: "border-box",
        }}
      >
        {selectedOption === "Payment Details" && (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
            >
              Payment Details
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                mb: 2,
                color: "#555",
              }}
            >
              Payment Gateway
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <TextField
                defaultValue="Paypal"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              />
              <Typography
                sx={{
                  color: "orange",
                  ml: 1,
                  cursor: "pointer",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                }}
              >
                Change
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                mb: 2,
                color: "#555",
              }}
            >
              Payment Method
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              {[
                { label: "Cardholder Name" },
                { label: "Card Number" },
                { label: "Expiry Date" },
                { label: "CVC" },
              ].map((field) => (
                <Box key={field.label} sx={{ width: { xs: "100%", sm: "45%" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "600",
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      mb: 0.5,
                    }}
                  >
                    {field.label}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  />
                </Box>
              ))}
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
              }}
            >
              {["Basic Plan", "Premium Plan", "Enterprise Plan"].map((plan) => (
                <Card
                  key={plan}
                  sx={{
                    p: 2,
                    flex: 1,
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 2,
                    position: "relative",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: "bold",
                    }}
                  >
                    {plan}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  >
                    $10/Month
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "orange",
                      color: "#fff",
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      px: 2,
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                    }}
                  >
                    Edit
                  </Button>
                </Card>
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "orange",
                  color: "#fff",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Edit
              </Button>
            </Box>
          </>
        )}

        {selectedOption === "Email Templates" && (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
            >
              Email Templates
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                mb: 2,
                color: "#555",
              }}
            >
              Test Email
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <EmailIcon sx={{ mr: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }} />
              <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                fs34@gmail.com
              </Typography>
              <Typography
                sx={{
                  color: "orange",
                  ml: 1,
                  cursor: "pointer",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                }}
              >
                Change
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                mb: 2,
                color: "#555",
              }}
            >
              Template List
            </Typography>
            {[
              {
                title: "Welcome Email",
                text: "This is a sample welcome email.",
              },
              {
                title: "Payment Confirmation Email",
                text: "This is a sample payment confirmation email.",
              },
            ].map((template) => (
              <Box key={template.title} sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  }}
                >
                  {template.title}
                </Typography>
                <Card
                  sx={{
                    p: 2,
                    boxShadow: 1,
                    minHeight: "100px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  {template.text}
                </Card>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "orange",
                  color: "#fff",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 2, sm: 3 },
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "orange",
                  color: "#fff",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 2, sm: 3 },
                }}
              >
                Edit
              </Button>
            </Box>
          </>
        )}

        {selectedOption === "Editor Limit" && (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
            >
              Editor Limit
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                mb: 2,
                color: "#555",
              }}
            >
              Maximum Editor Count
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                maxWidth: { xs: "100%", sm: "200px" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <TextField
                defaultValue="5"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              />
              <Typography
                onClick={handleOpen}
                sx={{
                  color: "orange",
                  ml: { xs: 0, sm: 1 },
                  cursor: "pointer",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Add Editor
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            <Card
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                mb: 3,
                boxShadow: 1,
              }}
            >
              <Typography
                sx={{ flex: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              >
                Notify Admin
              </Typography>
              <Switch defaultChecked sx={{ color: "orange" }} />
            </Card>

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                mb: 2,
                color: "#555",
              }}
            >
              Email to Notify
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                maxWidth: { xs: "100%", sm: "300px" },
              }}
            >
              <EmailIcon sx={{ mr: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }} />
              <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                admin@gmail.com
              </Typography>
              <Typography
                sx={{
                  color: "orange",
                  ml: 1,
                  cursor: "pointer",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                }}
              >
                Change
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "orange",
                  color: "#fff",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: "bold",
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Update
              </Button>
            </Box>
          </>
        )}
      </Box>
      <AddEditorModel isAddEditorModelOpen={isAddEditorModelOpen} onClose={handleClose} />
    </Box>
  );
};

export default Settings;