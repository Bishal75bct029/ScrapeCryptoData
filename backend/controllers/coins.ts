import { Request, Response } from "express";
import { prisma } from "../prisma";

export const index = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const { id: userId } = req.user;
        const { pageNum, noOfRows } = req.query;
        const numberOfCoins = await prisma.coin.count();
        const coins = await prisma.coin.findMany({
            take: Number(noOfRows) || 10,
            skip: Number(pageNum) || 0,
            include: {
                watchLists: {
                    where: { userId },
                    select: {
                        id: true,
                        min: true,
                        max: true
                    },
                },
            }
        });

        return res.json({
            message: coins,
            numberOfCoins
        });

    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error" + e });
    }
}