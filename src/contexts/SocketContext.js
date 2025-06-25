import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const generateRandomUserId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use the provided userId or generate a random one if not provided
    const userId = user ? user.id : generateRandomUserId();

    const createSocket = () => {
      const socketInstance = io('http://localhost:2000', {
        query: { userId },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000, // Start with 1 second delay
        reconnectionDelayMax: 5000, // Maximum delay of 5 seconds
        randomizationFactor: 0.5, // Add randomness to reconnection delay
        pingTimeout: 120000,
        pingInterval: 30000,
        transports: ['websocket', 'polling'], // Use both transports for better reliability
      });

      // Handle socket connection
      socketInstance.on('connect', () => {
        console.log('Connected with ID:', socketInstance.id);
        setSocket(socketInstance);
        setIsConnected(true);
        setLoading(false);

        // Log a message if the user reconnects after a disconnection
        if (!loading) {
          console.log('User reconnected after disconnection.');
        }
      });

      // Handle disconnection
      socketInstance.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        setIsConnected(false);
        setLoading(true);

        if (reason === 'ping timeout' || reason === 'transport close') {
          console.warn('Disconnected due to:', reason);
          attemptReconnect(socketInstance, userId);
        }
      });

      // Handle reconnection attempts
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts.`);
        setIsConnected(true);
        setLoading(false);
      });

      // Handle reconnection errors
      socketInstance.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
      });

      // Handle reconnection failures
      socketInstance.on('reconnect_failed', () => {
        console.error('Reconnection failed. Please try manually.');
      });

      return socketInstance;
    };

    const socketInstance = createSocket();

    // Cleanup function to disconnect the socket
    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('reconnect');
      socketInstance.off('reconnect_error');
      socketInstance.off('reconnect_failed');
      socketInstance.disconnect();
    };
  }, [user]); // Re-run effect if userId prop changes

  // Function to attempt reconnection
  const attemptReconnect = (socketInstance, userId) => {
    let retryCount = 0;
    const maxRetries = 5; // Maximum number of retries

    const reconnect = () => {
      if (retryCount >= maxRetries) {
        console.error('Max reconnection attempts reached. Please reconnect manually.');
        return;
      }

      console.log(`Attempting to reconnect (Attempt ${retryCount + 1})...`);

      setTimeout(() => {
        if (socketInstance.disconnected) {
          socketInstance.connect(); // Try to reconnect
          retryCount++;
          reconnect(); // Retry recursively
        }
      }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
    };

    reconnect();
  };

  // Manual reconnection function
  const reconnectSocket = () => {
    if (socket && socket.disconnected) {
      console.log('Manually reconnecting...');
      socket.connect();
    }
  };

  return (
    <SocketContext.Provider value={{ socket, loading, isConnected, reconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};