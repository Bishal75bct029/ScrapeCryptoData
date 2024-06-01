import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./utils";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (
            !token ||
            !Array.isArray(token) ||
            !token.startsWith('Bearer')
        )
            throw new Error;
        const extractedtoken = token.split(' ')[1];
        decodeToken(extractedtoken);
        //@ts-ignore
        req.user = decodeToken;

    } catch (_) {
        return res.status(400).json({
            message: "Invalid Token"
        });
    }
}