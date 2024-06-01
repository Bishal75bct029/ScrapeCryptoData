import { WebSocketServer, WebSocket } from "ws";

const clients: Map<number, WebSocket[]> = new Map();

export const sendNotification = (userId: number, message: string) => {
    const userClients = clients.get(userId);
    if (userClients) {
        userClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log('open and sent')
                client.send(message);
            }
        });
    }
};

export const socketConnection = (server: any) => {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws, req) => {
        const urlParams = new URLSearchParams(req.url?.substring(1));
        const userId = Number(urlParams.get('userId'));

        if (!clients.has(userId)) {
            clients.set(userId, []);
        }

        clients.get(userId)?.push(ws);
        console.log("connected", clients.get(userId), 'here', userId, 'there')

        ws.on('close', () => {
            const userClients = clients.get(userId);
            if (userClients) {
                const index = userClients.indexOf(ws);
                if (index !== -1) {
                    userClients.splice(index, 1);
                }
                if (userClients.length === 0) {
                    clients.delete(userId);
                }
            }
        });
    })
}