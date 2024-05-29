import axios from 'axios';

async function main() {
    let data: {
        cryptocurrency: {
            name: string,
            image: string,
            code: string
        },
        price: number,
        marketCap: number,
        change_24h: number
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
                cryptocurrency: {
                    img: item.iconUrl,
                    name: item.name,
                    code: item.symbol,
                },
                price: Number(item.price),
                marketCap: Number(item.marketCap),
                change_24h: Number(item.change)
            }
        });

        data = [
            ...data,
            ...res
        ]

        console.log('Fetched data for page ' + page)
        console.log(data[data.length - 1]);

        if (res.length < limit) break;

        page++;
    }

}

main()
