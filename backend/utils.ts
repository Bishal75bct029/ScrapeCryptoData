import fs from 'fs'

export const logNotification = (userId: number, message: string) => {
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const logMessage = `${timestamp} - UserId: ${userId} - ${message}\n`;

    fs.appendFile(`notifications${date}.log`, logMessage, (err: any) => {
        if (err) {
            console.error('Failed to log notification:', err);
        }
        console.log("logged successfully")
    });
};