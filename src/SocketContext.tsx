import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const BACKEND_API = "https://yazi-261b234dbfb9.herokuapp.com/";
    // const BACKEND_API = "http://192.168.1.153:3001";

    useEffect(() => {
        // TODO: Change the URL to your server's URL
        const newSocket = io(BACKEND_API, {
            transports: ['websocket'],
        });
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): Socket | null => useContext(SocketContext);

export default SocketContext;
