import React, { useState, useEffect, useContext } from "react";
import {
  Slab,
  Typography,
  Modal,
  Grid,
  Button,
  Box,
  Card,
  Avatar,
  Rating,
  TextField,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import CircularProgressLoading from "./CircularProgress";

const WriterTestimonialModal = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonialInputs, setTestimonialInputs] = useState({});
  const [submitting, setSubmitting] = useState({});

  const getWriters = async () => {
    if (!user || !["Student", "Editor"].includes(user.role)) {
      setError("Unauthorized access. Only Students and Editors can view writers.");
      toast.error("Unauthorized access.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const apiEndpoint =
        user.role === "Student"
          ? `${process.env.REACT_APP_BACKEND_BASE_URL}/students/writers`
          : `${process.env.REACT_APP_BACKEND_BASE_URL}/editors/writers`;

      const response = await axios.get(apiEndpoint, {
        withCredentials: true,
      });

      if (response.data.success) {
        let writersArray = [];
        if (user.role === "Student") {
            console.log(response.data)
          // Combine allWriters and topWriters, ensuring unique records by writer._id
          const allWriters = response.data.allWriters || [];
          const topWriters = response.data.topWriters || [];
          console.log(allWriters)
          const combinedWriters = [...allWriters, ...topWriters];
          // Use a Map to filter unique writers based on _id
          const uniqueWritersMap = new Map();
          combinedWriters.forEach((item) => {
            if (item.writer._id && !uniqueWritersMap.has(item.writer._id)) {
              uniqueWritersMap.set(item.writer._id, item.writer);
            }
          });
          writersArray = Array.from(uniqueWritersMap.values());
        } else {
          // For Editor, use response.data.writers directly
          writersArray = response.data.writers || [];
        }
        setWriters(writersArray);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch writers");
        toast.error(response.data.message || "Failed to fetch writers");
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || "Failed to fetch writers";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getWriters();
    }
  }, [open]);

  const handleToggleTestimonialInput = (writerId) => {
    setTestimonialInputs((prev) => ({
      ...prev,
      [writerId]: prev[writerId] ? "" : prev[writerId] || "",
    }));
  };

  const handleTestimonialChange = (writerId, value) => {
    setTestimonialInputs((prev) => ({
      ...prev,
      [writerId]: value,
    }));
  };

  const submitTestimonial = async (writerId) => {
    if (!user || !["Student", "Editor"].includes(user.role)) {
      toast.error("Unauthorized. Only Students and Editors can submit testimonials.");
      return;
    }

    const testimonial = testimonialInputs[writerId]?.trim();
    if (!testimonial) {
      toast.error("Please enter a testimonial");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [writerId]: true }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/writers/submit-testimonial/${writerId}`,
        {testimonial },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Testimonial submitted successfully!");
        setTestimonialInputs((prev) => ({ ...prev, [writerId]: "" }));
        handleToggleTestimonialInput(writerId);
      } else {
        toast.error(response.data.message || "Failed to submit testimonial");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Failed to submit testimonial");
    } finally {
      setSubmitting((prev) => ({ ...prev, [writerId]: false }));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="writer-testimonial-modal"
      aria-describedby="writer-testimonial-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          width: { xs: "90%", md: "90%" },
          maxWidth: "700px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ToastContainer />
        {/* Fixed Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "white",
            pb: 2,
          }}
        >
          <Typography
            id="writer-testimonial-modal"
            variant="h6"
            fontWeight="bold"
            align="center"
            sx={{ mb: 1 }}
          >
            Writers Directory
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary" }}
          >
            Submit testimonials for writers you have collaborated with.
          </Typography>
        </Box>
        {/* Scrollable Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mt: 1,
          }}
        >
          {loading ? (
            <CircularProgressLoading />
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : writers.length === 0 ? (
            <Typography align="center" fontWeight="bold">
              No Writers Found!
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {writers.map((writer, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      borderBottom: "1px solid lightgray",
                      borderRight: "1px solid lightgray",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <Rating
                      value={writer.rating || 0}
                      size="small"
                      sx={{ marginLeft: "auto" }}
                      readOnly
                    />
                    <Avatar
                      src={writer.photoUrl || ""}
                      alt={writer.name?.[0] || "W"}
                      sx={{
                        width: 50,
                        height: 50,
                        marginTop: 1,
                        position: "relative",
                      }}
                    />
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {writer._id?.slice(0, 5) || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginTop: 1 }}
                      >
                        {writer.writingExpertise?.[0] || "Unknown"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#5f9ea0", fontWeight: "bold", marginTop: 2 }}
                      >
                        $0
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => handleToggleTestimonialInput(writer._id)}
                      sx={{
                        borderColor: "orange",
                        color: "orange",
                        marginTop: 2,
                        borderRadius: "20px",
                        width: { xs: "100%", sm: "55%" },
                        textAlign: "center",
                        "&:hover": { borderColor: "darkorange", color: "darkorange" },
                      }}
                      disabled={submitting[writer._id]}
                    >
                      {testimonialInputs[writer._id] ? "Cancel" : "Submit Testimonial"}
                    </Button>
                    {testimonialInputs[writer._id] !== undefined && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Enter your testimonial"
                          value={testimonialInputs[writer._id] || ""}
                          onChange={(e) => handleTestimonialChange(writer._id, e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => submitTestimonial(writer._id)}
                          disabled={submitting[writer._id]}
                          sx={{
                            bgcolor: "orange",
                            color: "white",
                            borderRadius: "20px",
                            width: { xs: "100%", sm: "55%" },
                            "&:hover": { bgcolor: "darkorange" },
                          }}
                        >
                          {submitting[writer._id] ? (
                            <CircularProgress
                              size={24}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: "orange",
              color: "white",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              borderRadius: 2,
              px: 3,
              py: 0.5,
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WriterTestimonialModal;