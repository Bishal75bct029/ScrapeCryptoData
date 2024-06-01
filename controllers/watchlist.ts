import { Request, Response } from "express";
import { prisma } from "../prisma";

export const index = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const user: { id: number, email: string } = req.user;
        const watchlist = await prisma.watchList.findMany({
            where: {
                userId: user.id
            }
        });
        return res.status(200).json({ message: watchlist });

    } catch (e) {

    }
}

export const create = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const user: { id: number, email: string } = req.user;
        const { id } = req.body;
        const existingUserWatchList = await prisma.watchList.findFirst({
            where: {
                coinId: id,
                userId: user.id
            }
        })
        if (existingUserWatchList) throw new Error("Already exists on watchlist");
        const createdWatchList = await prisma.watchList.create({
            data: {
                userId: user.id,
                coinId: id,
                min: req.body.minPrice,
                max: req.body.maxPrice
            }
        })
        return res.status(200).json({ message: createdWatchList });

    } catch (e) {

    }
}

export const update = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user: { id: number, email: string } = req.user;
        const { id, minPrice, maxPrice } = req.body;

        const existingWatchList = await prisma.watchList.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingWatchList) {
            return res.status(404).json({ message: 'WatchList entry not found' });
        }

        const updatedWatchList = await prisma.watchList.update({
            where: {
                id: existingWatchList.id,
            },
            data: {
                min: minPrice,
                max: maxPrice,
            },
        });

        return res.status(200).json({ message: 'WatchList updated successfully', updatedWatchList });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user: { id: number, email: string } = req.user;
        const { id } = req.body;

        const existingWatchList = await prisma.watchList.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingWatchList) {
            return res.status(404).json({ message: 'WatchList entry not found' });
        }

        await prisma.watchList.delete({
            where: {
                id: existingWatchList.id,
            },
        });

        return res.status(200).json({ message: 'WatchList deleted successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};