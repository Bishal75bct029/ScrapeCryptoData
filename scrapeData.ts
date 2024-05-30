import axios from 'axios';
import { prisma } from './prisma'

async function main() {
    let data: {
        name: string,
        code: string
        imageUrl: string,
        price: string,
        marketCap: string,
        change24h: number
    }[] = [];

    let page = 0;
    const limit = 50;

    while (true) {
        const response = await axios.get('https://coinranking.com/api/v2/coins', {
            params: {
                offset: page * limit,
                limit,
                timePeriod: '24h',
                tiers: [1, 2],
                referenceCurrencyUuid: 'yhjMzLPhuIDl',
                orderBy: 'marketCap',
                orderDirection: 'desc',
            },
            headers: {
                'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://coinranking.com/?page=3',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': '"Linux"'
            }
        });

        const res = response.data.data.coins.map((item: any) => {
            return {
                name: item.name,
                code: item.symbol,
                imageUrl: item.iconUrl,
                price: item.price,
                marketCap: item.marketCap,
                change24h: Number(item.change)
            }
        });

        data = [
            ...data,
            ...res
        ]
        
        if (res.length < limit) break;

        page++;
    }

    for (const item of data) {
        await prisma.coin.upsert({
            create: item,
            update: item,
            where: {
                code: item.code
            }
        })
    }
}

main()
