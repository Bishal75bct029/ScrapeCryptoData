import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './config'
import fs from 'fs'

interface NotificationMessage {
    userId: number;
    message: string;
}

export const generateToken = (data: {}) => {
    return jwt.sign({ data, exp: '365d' }, SECRET_KEY);
}

export const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY)
}

export const logNotification = (userId: number, message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - UserId: ${userId} - ${message}\n`;
    fs.appendFile('notifications.log', logMessage, (err: any) => {
        if (err) {
            console.error('Failed to log notification:', err);
        }
    });
};