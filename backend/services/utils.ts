import fs from 'fs'
import path from 'path'

export const logNotification = (userId: number, message: string) => {
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const logMessage = `${timestamp} - UserId: ${userId} - ${message}\n`;

    console.log(__dirname)
    const dir = path.resolve(__dirname, '../notifications')

    fs.appendFile(`${dir}/notifications${date}.log`, logMessage, (err: any) => {
        if (err) {
            console.error('Failed to log notification:', err);
        }
        console.log("logged successfully")
    });
};

export const convertToNumber = (value: string) => {
    try {
        console.log('here')
        const suffixes: any = {
            'm': 1e6,
            'b': 1e9,
            't': 1e12
        };

        const matches = value.match(/([\d.]+)\s*([a-zA-Z]+)/);

        if (!matches) {
            return String(value);
        }

        const numericValue = parseFloat(matches[1]);
        const suffix: string = matches[2].toLowerCase();

        if (!startsWithAny(suffix, Object.keys(suffixes))) {
            throw new Error('Invalid suffix');
        }

        return String(numericValue * suffixes[suffix[0]]);
    } catch (_) {

    }
}

function startsWithAny(string: string, prefixes: string[]) {
    return prefixes.some(prefix => string.startsWith(prefix));
}