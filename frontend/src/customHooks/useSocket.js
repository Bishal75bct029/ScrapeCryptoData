import { useEffect, useState } from 'react';

const useSocket = (url) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            const message = event.data
            console.log(message,"bat")
            setMessages((prev) => [...prev, message]);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    return { socket, messages, sendMessage };
};

export default useSocket;
