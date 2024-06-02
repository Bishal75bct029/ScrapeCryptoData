import { prisma } from './prisma';
import { logNotification } from './services/utils';
import { fetchData } from './fetchData';
import { METHOD } from './config/config';
import { puppeteerScrape } from './pupeeter';

async function main() {
    console.log("Started fetching data");

    if (METHOD == 'fetch') var data = await fetchData();
    else var data = await puppeteerScrape();

    console.log("ending scraping");

    for (const item of data) {
        const coin = await prisma.coin.upsert({
            create: item,
            update: item,
            where: {
                code: item.code
            }
        })

        const watchlists = await prisma.watchList.findMany({
            where: {
                coinId: coin.id,
            },
            include: {
                user: true
            }
        });

        if (watchlists.length > 0)
            console.log(watchlists)

        for (const watchlist of watchlists) {
            const price = parseFloat(item.price);
            if (price < parseFloat(watchlist.min) || price > parseFloat(watchlist.max)) {
                const info = {
                    userId: watchlist.userId,
                    message: `Price alert for ${item.name}: ${price}`
                }
                if (process.send) {
                    console.log('send')
                    process.send(info);
                }

                logNotification(info.userId, info.message);
            }
        }
    }
}

setInterval(main, 300000);
main()
