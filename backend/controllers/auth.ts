import { Request, Response } from "express";
import { prisma } from "../prisma";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config/config";

export async function login(req: Request, res: Response) {
    if (!req.body.token) {
        res.status(400)

        return { message: "No token provided" }
    }

    const client = new OAuth2Client()

    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email || !payload?.name) throw new Error('Invalid token')

        let user = await prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.name
                }
            })
        }

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token: req.body.token
        })
    } catch (e) {
        console.log(e)
        res.status(401).json({ message: 'User not found' })
    }
}