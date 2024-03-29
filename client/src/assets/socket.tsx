// socket.js
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { checkLocalStorage } from './constants';

// TODO: CAMBIAR POR ONRENDER
//const SocketURL = 'http://localhost:3000'
const SocketURL = 'https://top-wetext-api.onrender.com'

export function useSocket(userId = '') {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
            const newSocket = io(SocketURL, {
            transports: ['websocket', 'polling', 'flashsocket']
        });

        newSocket.emit("setup", userId);
        newSocket.on("connection", () => {
            console.log('Cui cui');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if(!checkLocalStorage()) return
        const userId = JSON.parse(localStorage.getItem('idWeText') || '');
        const newSocket = io(SocketURL, {
            transports: ['websocket', 'polling', 'flashsocket']
        });

        newSocket.emit("setup", userId);
        newSocket.on("connection", () => {
            console.log('Cui cui');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Asegurarse de desconectar el socket cuando el componente se desmonte
        };
    }, []);

    return socket;
}