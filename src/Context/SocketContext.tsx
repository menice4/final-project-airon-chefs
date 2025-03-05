import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Create a context to store the socket connection, defaults to null until connection established
const SocketContext = createContext<Socket | null>(null);

// Create custom hook to allow any component to easily access the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// Set up the socketProvider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // create state variable to store the WebSocket connection
  const [socket, setSocket] = useState<Socket | null>(null);

  // when component mounts, it creates a new websocket connection to backend (CHANGE THIS FOR DEPLOYED BACKEND)
  // stores socket instance in state
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Close websocket connection when component unmounts to prevent memory leaks
    // empty dependency array
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
