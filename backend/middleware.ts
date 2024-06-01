import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "./config";
import { prisma } from "./prisma";

export type RequestUser = {
    id: number,
    name: string,
    email: string
}

export const isLoggedIn = async (req: Request & { user?: RequestUser }, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').split(' ')[1]

    const client = new OAuth2Client()

    try {
        if (!token) throw new Error;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) throw new Error

        let user = await prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        })

        if (!user) {
            throw new Error;
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        next();
    } catch (_) {
        console.log(_)
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}