import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from "express"
import { router } from "./routes/route";
import { PORT } from "./config";
import { fork } from 'child_process';
import { WebSocketServer, WebSocket } from "ws";
import path from "path";

const app = express()

app.use(express.json())
app.use(express.urlencoded());

app.use('/', router)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: "Internal Server Error" });
})

const server = app.listen(PORT, () => {
    console.log(`Server listening to the port ${PORT}`)
})

const wss = new WebSocketServer({ server })

const clients: Map<number, WebSocket[]> = new Map();

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url?.substring(1));
    const userId = Number(urlParams.get('userId'));

    if (!clients.has(userId)) {
        clients.set(userId, []);
    }

    clients.get(userId)?.push(ws);

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

const childProcess = fork(path.join(__dirname, 'fetchData.js'));

const sendNotification = (userId: number, message: string) => {
    const userClients = clients.get(userId);
    if (userClients) {
        userClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};

type Message = {
    userId: number,
    message: string
}

childProcess.on('message', (message: Message) => {
    console.log('Message from child process:');
    const { userId, message: notificationMessage } = message;
    sendNotification(userId, notificationMessage);
});