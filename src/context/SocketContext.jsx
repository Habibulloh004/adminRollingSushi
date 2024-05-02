import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
  const [socketMe, setSocketMe] = useState(null);
  const [process, setProcess] = useState([160]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACK, {
      reconnection: false,
    });

    setSocketMe(socket);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", (data) => {
      console.log(data);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketMe, process, setProcess }}>
      {children}
    </SocketContext.Provider>
  );
};
