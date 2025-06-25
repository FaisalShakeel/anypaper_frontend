import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  useMediaQuery,
  CircularProgress,
  Modal,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import ErrorMessage from '../ErrorMessage';
import CircularProgressLoading from '../CircularProgress';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Editors');
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileView, setMobileView] = useState('chats');
  const [allChats, setAllChats] = useState([]);
  const [selectedChatMessages, setSelectedMessages] = useState([]);
  const [text, setText] = useState('');
  const [caption, setCaption] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false); // For file uploads
  const [isSendingNormalMessage, setIsSendingNormalMessage] = useState(false); // For normal messages
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isSmallDevice = useMediaQuery('(max-width:1300px)');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchChatMessages = async (chatId) => {
    setMessagesLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:5000'
        }/chats/messages/${chatId}`,
        { params: { userId: user.id, role: 'student' } }
      );
      return response.data.messages || [];
    } catch (e) {
      console.error('Fetch chat messages error:', e);
      toast.error('Failed to load chat messages. Please try again.');
      return [];
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    if (!chat) return;
    console.log('Selecting Chat', chat);
    setSelectedChat(chat);
    setMobileView(isSmallDevice ? 'messages' : 'chats');

    const messages = await fetchChatMessages(chat._id);
    setSelectedMessages(messages);
    setTimeout(scrollToBottom, 100);
  };

  const convertIntoTimeFormat = (dateTimeString) => {
    if (!dateTimeString) return 'Unknown time';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return 'Invalid time';
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Error formatting time';
    }
  };

  const handleBackToChats = () => {
    setMobileView('chats');
    setSelectedChat(null);
    setSelectedMessages([]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Unsupported file type. Please upload an image, video, or PDF.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }
      setSelectedFile(file);
      setPreviewOpen(true);
    }
    event.target.value = null;
  };

  const handleSendFile = async () => {
    console.log('handleSendFile called', { text, caption, selectedFile });
    if (!text.trim() && !caption.trim() && !selectedFile) {
      toast.error('Please enter a message or select a file.');
      return;
    }
    if (!user?.id || !selectedChat?.otherUser?._id || !selectedChat?._id) {
      toast.error('Cannot send message: Invalid user or chat data');
      return;
    }

    const isFileUpload = !!selectedFile;
    const messageText = isFileUpload ? caption : text;

    // Set appropriate loading state
    if (isFileUpload) {
      setIsSendingMessage(true);
    } else {
      setIsSendingNormalMessage(true);
    }

    try {
      const formData = new FormData();
      formData.append('senderId', user.id);
      formData.append('senderRole', 'student');
      formData.append('receiverId', selectedChat.otherUser._id);
      formData.append('chatId', selectedChat._id);
      if (messageText.trim()) {
        formData.append('text', messageText);
      }
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:5000'}/chats/send-message`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const newMessage = response.data;
      if (!newMessage) throw new Error('No message returned from server');

      setAllChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                lastMessage: newMessage,
                messages: chat.messages
                  ? [...chat.messages, newMessage]
                  : [newMessage],
              }
            : chat
        )
      );

      setSelectedMessages((prevMessages) => [...prevMessages, newMessage]);
      setTimeout(scrollToBottom, 100);
      setText('');
      setCaption('');
      setSelectedFile(null);
      setPreviewOpen(false);
    } catch (e) {
      console.error('Send message error:', e);
      toast.error(
        e.response?.data?.message || 'Failed to send message. Please try again.'
      );
    } finally {
      // Reset appropriate loading state
      if (isFileUpload) {
        setIsSendingMessage(false);
      } else {
        setIsSendingNormalMessage(false);
      }
    }
  };

  const getAllChats = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:5000'
        }/chats/all-chats/${user.id}/student`,
        { params: { userId: user.id, role: 'student' } }
      );

      const chats = response.data?.chats || [];
      setAllChats(chats);
    } catch (e) {
      console.error('Get chats error:', e);
      setError(
        e.response?.data?.message || 'Failed to load chats. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSmallDevice) {
      if (selectedChat) {
        setMobileView('messages');
      } else {
        setMobileView('chats');
      }
    } else {
      setMobileView('chats');
    }
  }, [isSmallDevice, selectedChat]);

  useEffect(() => {
    getAllChats();
  }, [user]);

  useEffect(() => {
    if (!socket) {
      console.warn('Socket not initialized');
      return;
    }

    socket.on('new-message', (message) => {
      if (!message || !message.chat) {
        console.warn('Invalid message received:', message);
        return;
      }

      console.log('New Message Received', message);

      if (selectedChat && message.chat === selectedChat._id) {
        setSelectedMessages((prevMessages) => [...prevMessages, message]);
        setTimeout(scrollToBottom, 100);
      }

      let chatExists = false;

      setAllChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id.toString() === message.chat.toString()) {
            chatExists = true;
            return {
              ...chat,
              lastMessage: message,
              messages: chat.messages
                ? [...chat.messages, message]
                : [message],
            };
          }
          return chat;
        });
        return updatedChats;
      });

      if (!chatExists) {
        getAllChats();
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('Connection error. Please check your network.');
    });

    return () => {
      socket.off('new-message');
      socket.off('error');
    };
  }, [socket, selectedChat]);

  const renderAttachment = (attachment) => {
    if (!attachment) return null;
    const fileType = attachment.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      return (
        <img
          src={attachment}
          alt="Attachment"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '300px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginTop: '8px',
          }}
        />
      );
    } else if (fileType === 'mp4') {
      return (
        <video
          src={attachment}
          controls
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '300px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginTop: '8px',
          }}
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <a
          href={attachment}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0b3953', textDecoration: 'underline' }}
        >
          View PDF
        </a>
      );
    } else {
      return (
        <a
          href={attachment}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0b3953', textDecoration: 'underline' }}
        >
          Download File
        </a>
      );
    }
  };

  const renderPreview = () => {
    if (!selectedFile) return null;
    const fileType = selectedFile.type.split('/')[0];
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    const previewUrl = URL.createObjectURL(selectedFile);

    return (
      <Box sx={{ textAlign: 'center' }}>
        {fileType === 'image' ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '12px',
              objectFit: 'contain',
            }}
          />
        ) : fileType === 'video' ? (
          <video
            src={previewUrl}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '12px',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography sx={{ fontSize: '16px', color: '#333' }}>
            File: {selectedFile.name}
          </Typography>
        )}
      </Box>
    );
  };

  const filteredChats = allChats.filter((chat) => {
    const paperTypeMatch = chat?.order?.typeOfPaper
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const messageMatch = chat?.messages?.some((msg) =>
      msg?.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return paperTypeMatch || messageMatch;
  });

  if (error && !loading) {
    return <ErrorMessage message={error} onTryAgain={getAllChats} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f9f9f9',
        padding: 0,
        gap: 2,
        flexDirection: isSmallDevice ? 'column' : 'row',
      }}
    >
      {(!isSmallDevice || mobileView === 'chats') && (
        <Box
          sx={{
            width: isSmallDevice ? '100%' : '30%',
            bgcolor: '#F7F8FA',
            borderRadius: 2,
            padding: 2,
            display:
              isSmallDevice && mobileView === 'messages' ? 'none' : 'block',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}
          >
            <TextField
              placeholder="Search chats"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: '#fff',
                width: '100%',
                borderRadius: '50px',
                height: 40,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                  height: '100%',
                  padding: '5px 12px',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
                '& .MuiInputBase-input': { fontSize: '14px' },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              marginBottom: 2,
            }}
          >
            {['Editors', 'Writers'].map((tab) => (
              <Typography
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  width: '115px',
                  fontSize: '13px',
                  border: `2px solid ${
                    activeTab === tab ? 'orange' : 'transparent'
                  }`,
                  color: activeTab === tab ? '#000' : '#000',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                {tab}
              </Typography>
            ))}
          </Box>

          <Divider />

          <Box
            sx={{
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c4c4c4',
                borderRadius: '50px',
                border: '2px solid transparent',
                backgroundClip: 'content-box',
              },
              '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a0a0a0' },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f0f0f0',
                borderRadius: '50px',
              },
            }}
          >
            {loading ? (
              <CircularProgressLoading />
            ) : filteredChats.length === 0 ? (
              <Typography
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'gray',
                  mt: 2,
                }}
              >
                No Chats
              </Typography>
            ) : (
              filteredChats
                .filter((chat) => {
                  if (!chat?.otherUserRole) return false;
                  if (activeTab === 'Editors') {
                    return chat.otherUserRole === 'editor';
                  } else if (activeTab === 'Writers') {
                    return chat.otherUserRole === 'writer';
                  }
                  return true;
                })
                .map((chat) => (
                  <ListItem
                    key={chat?._id || 'unknown'}
                    button
                    onClick={() => handleChatSelect(chat)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      bgcolor:
                        selectedChat?._id === chat?._id
                          ? 'rgba(8, 126, 138, 0.1)'
                          : 'transparent',
                      marginBottom: 1,
                      padding: 1,
                      borderLeft:
                        selectedChat?._id === chat?._id
                          ? '3px solid #0b3953'
                          : '',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: 'rgba(8, 126, 138, 0.1)' },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'black',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        mb: 0.5,
                      }}
                    >
                      {chat?.order?.typeOfPaper || 'Unknown Paper'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'gray',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        {chat?.order?._id || 'No Order ID'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#888',
                          cursor: 'pointer',
                          fontSize: '9px',
                        }}
                      >
                        {convertIntoTimeFormat(
                          chat?.lastMessage?.timestamp ||
                            chat?.lastMessage?.createdAt
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'darkcyan',
                            cursor: 'pointer',
                            height: '50px',
                            width: '50px',
                          }}
                        >
                          {chat?.otherUserRole === 'editor' ? 'E' : 'W'}
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flex: 1, ml: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            wordBreak: 'break-word',
                            color: chat?.unread ? '#0b3953' : '#A0A6B1',
                            cursor: 'pointer',
                            fontSize: '10px',
                          }}
                        >
                          {chat?.lastMessage?.attachment
                            ? 'Attachment'
                            : chat?.lastMessage?.text || 'No message'}
                        </Typography>
                      </Box>
                      {chat?.unread && (
                        <Box
                          sx={{
                            bgcolor: 'orange',
                            color: 'white',
                            borderRadius: '50%',
                            width: 16,
                            height: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: 1,
                          }}
                        >
                          {chat.unread}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))
            )}
          </Box>
        </Box>
      )}

      {(!isSmallDevice || mobileView === 'messages') && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRadius: 0,
            padding: 2,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c4c4c4',
              borderRadius: '50px',
              border: '2px solid transparent',
              backgroundClip: 'content-box',
            },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a0a0a0' },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0',
              borderRadius: '50px',
            },
          }}
        >
          {selectedChat ? (
            <>
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'white',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1.5,
                  padding: 1.5,
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                {isSmallDevice && (
                  <IconButton onClick={handleBackToChats}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Box>
                  <Typography variant="h1" fontSize={13} fontWeight="bold">
                    {selectedChat?.order?.typeOfPaper || 'Unknown Paper'}
                  </Typography>
                  <Typography sx={{ color: '#A0A6B1', fontSize: 12 }}>
                    {`Order # ${selectedChat?.order?._id || 'No Order ID'}`}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  padding: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  overflow: 'auto',
                  position: 'relative',
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c4c4c4',
                    borderRadius: '50px',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                  },
                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a0a0a0' },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50px',
                  },
                }}
              >
                {messagesLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <CircularProgressLoading />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {selectedChatMessages.map((msg) => (
                      <Box
                        key={msg?._id || 'unknown'}
                        sx={{
                          alignSelf:
                            msg?.sender?.userId === user?.id
                              ? 'flex-end'
                              : 'flex-start',
                          width: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems:
                            msg?.sender?.userId === user?.id
                              ? 'flex-end'
                              : 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor:
                              msg?.sender?.userId === user?.id
                                ? '#E7F3F4'
                                : '#F7F8FA',
                            color:
                              msg?.sender?.userId === user?.id
                                ? 'black'
                                : 'black',
                            padding: 2,
                            width: isSmallDevice ? '90%' : '665px',
                            borderRadius: 2,
                            minHeight: '48px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                        >
                          {msg?.text && (
                            <Typography sx={{ fontSize: 14 }}>
                              {msg.text}
                            </Typography>
                          )}
                          {renderAttachment(msg.attachment)}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#888',
                            marginTop: '0.5',
                            fontSize: 10,
                          }}
                        >
                          {convertIntoTimeFormat(
                            msg?.createdAt || msg?.timestamp
                          )}
                        </Typography>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 7,
                  padding: 1.5,
                  bgcolor: 'white',
                  borderTop: '1px solid #e0e0e0',
                  position: 'relative',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*,video/mp4,application/pdf,.doc,.docx"
                />
                <IconButton
                  onClick={() => fileInputRef.current.click()}
                  sx={{ fontSize: 20 }}
                >
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(event) => {
                    console.log('Key pressed:', event.key);
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSendFile();
                    }
                  }}
                  placeholder="Type a message"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      '& fieldset': { border: '1px solid #e0e0e0' },
                      '&:hover fieldset': { border: '1px solid #a0a0a0' },
                      '&.Mui-focused fieldset': { border: '2px solid #a0a0a0' },
                    },
                    fontSize: 14,
                  }}
                />
                <IconButton
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  sx={{ fontSize: 20 }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    console.log('Send button clicked');
                    handleSendFile();
                  }}
                  disabled={isSendingNormalMessage}
                  sx={{
                    fontSize: 20,
                    color: '#087E8A',
                    '&:hover': {
                      bgcolor: 'rgba(8, 126, 138, 0.1)',
                    },
                  }}
                >
                  {isSendingNormalMessage ? (
                    <CircularProgress
                      sx={{ height: '10px', width: '10px', color: 'gray' }}
                      thickness={7}
                    />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
                {showEmojiPicker && (
                  <Box sx={{ position: 'absolute', bottom: '60px', right: '10px' }}>
                    <EmojiPicker
                      onEmojiClick={(emojiObject) => {
                        setText((prev) => prev + emojiObject.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Modal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '16px',
                    padding: 3,
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Preview
                    </Typography>
                    <IconButton onClick={() => setPreviewOpen(false)}>
                      <CloseIcon sx={{ color: '#333' }} />
                    </IconButton>
                  </Box>
                  {renderPreview()}
                  <TextField
                    fullWidth
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption (optional)"
                    variant="outlined"
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '& fieldset': { border: '1px solid #e0e0e0' },
                        '&:hover fieldset': { border: '1px solid #a0a0a0' },
                        '&.Mui-focused fieldset': { border: '2px solid #087E8A' },
                      },
                    }}
                  />
                  <Button
                    onClick={handleSendFile}
                    variant="contained"
                    sx={{
                      mt: 2,
                      borderRadius: '12px',
                      bgcolor: '#087E8A',
                      '&:hover': {
                        bgcolor: '#066B75',
                      },
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send'}
                  </Button>
                </Box>
              </Modal>
            </>
          ) : (
            <Typography
              sx={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}
            >
              Select a chat to start messaging
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Chat;