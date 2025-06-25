import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Modal,
    Tabs,
    Tab,
    Avatar,
    Button,
    Radio,
} from "@mui/material";
import { Star, ArrowForwardIos } from "@mui/icons-material";
import { useEditorContext } from "../../../contexts/EditorContext";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AssignOrderModel = ({ open, handleClose, order }) => {
    const { allEditors } = useEditorContext();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedEditor, setSelectedEditor] = useState(null);
    const [selectedWriter, setSelectedWriter] = useState(null);
    const [isAssignEditorAndWriter, setIsAssigningEditorAndWriter] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCardSelect = (id) => {
        if (activeTab === 0) {
            setSelectedEditor(id);
        } else {
            setSelectedWriter(id);
        }
    };

    const assignEditorAndWriterToOrder = async () => {
        setIsAssigningEditorAndWriter(true);
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/assign-editor-and-writer`,
                { orderId: order._id, editorId: selectedEditor, writerId: selectedWriter },
                { withCredentials: true }
            );
            if (response.data.success) {
                toast.success(response.data.message,{position:"top-center"});
                setTimeout(() => {
                    handleClose();
                }, 1000);
            } else {
                toast.error(response.data.message,{position:"top-center"});
            }
        } catch (e) {
            toast.error(e.response ? e.response.data.message : e.message,{position:"top-center"});
        } finally {
            setIsAssigningEditorAndWriter(false);
        }
    };

    useEffect(() => {
        if (order) {
            if (order.editorId) setSelectedEditor(order.editorId);
            if (order.writerId) setSelectedWriter(order.writerId);
        }
    }, [order]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="assign-order-modal"
            aria-describedby="assign-order-details"
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
                <ToastContainer />
                {/* Order Details */}
                <Box sx={{ mt: 4, display: "flex", flexDirection: "row", gap: 4 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", mb: 1 }}>
                        Order ID: <span style={{ fontWeight: "400" }}>{order?._id || "N/A"}</span>
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
                        Order Title: <span style={{ fontWeight: "400" }}>{order?.typeOfPaper || "N/A"}</span>
                    </Typography>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        mt: 2,
                        "& .MuiTab-root": {
                            textTransform: "none",
                            borderRadius: "50px", // Fully rounded tabs
                            border: "1px solid orange",
                            color: "orange",
                            px: 3,
                            py: 0.5,
                            mx: 1,
                            fontSize: "0.85rem",
                        },
                        "& .MuiTab-root.Mui-selected": {
                            bgcolor: "orange",
                            color: "white !important", // Force white text for selected tab
                        },
                        "& .MuiTabs-indicator": {
                            display: "none",
                        },
                    }}
                >
                    <Tab label="Editors" />
                    <Tab label="Writers" />
                </Tabs>

                <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    {(activeTab === 0 ? allEditors : order?.bidders || []).length === 0 ? (
                        <Typography sx={{ textAlign: "center", color: "orange", py: 2 }}>
                            {activeTab === 0 ? "No Editors Available" : "No Bidders Available"}
                        </Typography>
                    ) : (
                        (activeTab === 0 ? allEditors : order?.bidders || []).map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow:
                                        (activeTab === 0 ? selectedEditor : selectedWriter) === item._id
                                            ? "0 0 0 1px orange"
                                            : "0 1px 1px rgba(0, 0, 0, 0.1)",
                                    bgcolor: "white",
                                    cursor: "pointer",
                                    "&:hover": { boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" },
                                    transition: "box-shadow 0.2s",
                                }}
                                onClick={() => handleCardSelect(item._id)}
                            >
                                <Radio
                                    checked={(activeTab === 0 ? selectedEditor : selectedWriter) === item._id}
                                    sx={{
                                        color: "orange",
                                        "&.Mui-checked": { color: "orange" },
                                        mr: 2,
                                    }}
                                />
                                <Avatar
                                    src={item.avatar}
                                    alt={item.name || "User"}
                                    sx={{ width: 48, height: 48, mr: 2 }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ fontWeight: "600", fontSize: "0.9rem", mb: 0.5 }}>
                                        {item._id}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: "400",
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {activeTab === 1 ? item.writingExpertise?.[0] || "N/A" : "Editor"}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Star sx={{ color: "orange", fontSize: 16, mr: 0.5 }} />
                                    <Typography sx={{ fontWeight: "500", fontSize: "0.8rem" }}>
                                        {item.rating || 0}
                                    </Typography>
                                </Box>
                                <ArrowForwardIos sx={{ fontSize: 16, color: "gray", ml: 2 }} />
                            </Box>
                        ))
                    )}
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            bgcolor: "orange",
                            color: "white",
                            fontSize: "0.85rem",
                            borderRadius: 2,
                            px: 3,
                            py: 0.5,
                            "&:hover": { bgcolor: "darkorange" },
                        }}
                    >
                        Close
                    </Button>
                    {selectedWriter && selectedEditor && (
                        <Button
                            onClick={assignEditorAndWriterToOrder}
                            disabled={isAssignEditorAndWriter}
                            variant="contained"
                            sx={{
                                bgcolor: "orange",
                                color: "white",
                                fontSize: "0.85rem",
                                borderRadius: 2,
                                px: 3,
                                py: 0.5,
                                "&:hover": { bgcolor: "darkorange" },
                            }}
                        >
                            {isAssignEditorAndWriter ? "Assigning" : "Assign Now"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default AssignOrderModel;