import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from "express"
import { router } from "./routes/route";
import { PORT } from "./config/config";
import { fork } from 'child_process';
import path from "path";
import cors from 'cors'
import { sendNotification } from "./socket/socket";
import { socketConnection } from './socket/socket';

const app = express()

app.use(express.json())

app.use(cors())

app.use('/', router)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: "Internal Server Error" });

})

const server = app.listen(PORT, () => {
    console.log(`Server listening to the port ${PORT}`)
})

socketConnection(server);


const childProcess = fork(path.join(__dirname, 'scrapeData.ts'));

childProcess.on('message', (message: {
    userId: number,
    message: string
}) => {
    console.log('Message from child process:', message);
    const { userId, message: notificationMessage } = message;
    sendNotification(userId, notificationMessage);
});