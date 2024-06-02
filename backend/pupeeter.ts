import puppeteer from 'puppeteer';
// import { convertToNumber } from './services/utils';

interface CoinData {
  name: string;
  code: string;
  imageUrl: string;
  price: string;
  marketCap: string;
  change24h: number;
}

let data: CoinData[] = [];

export const puppeteerScrape = async () => {
  console.log("Scrapping Process Started");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let i = 1;
  let previousLength = 0;

  while (true) {


    await page.goto('https://coinranking.com/?page=' + i);

    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('.table--light');

    const tableData = await page.evaluate(() => {
      //I implemented this function here because i was not able to use the function defined in my utils file as it runs in browser context
      
      const convertToNumber = (value: string) => {
        try {
          console.log('here')
          const suffixes: any = {
            'm': 1e6,
            'b': 1e9,
            't': 1e12
          };

          value = value.replace(/[$,' ']/g, '');
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

      const tableRows = document.querySelectorAll('.table--light tbody tr');
      
      const rowData: CoinData[] = [];
      
      for (const row of tableRows) {
        const cellData: Partial<CoinData> = {};
        const names = row.querySelectorAll('.profile__link');
        const code = row.querySelectorAll('.profile__subtitle-name');
        const source = row.querySelectorAll('.profile__logo')
        const _24h = row.querySelectorAll('.change');
        const price = row.querySelectorAll('td:nth-child(2)');
        const marketCap = row.querySelectorAll('td:nth-child(3)');

        names.forEach((cell: any) => {
          cellData.name = cell.innerText;
        });

        code.forEach((cell: any) => {
          console.log(cell);
          cellData.code = cell.innerText;
        });

        price?.forEach((cell: any) => {
          cellData.price = convertToNumber(String(cell.innerText));
        });

        marketCap?.forEach((cell: any) => {
          cellData.marketCap = convertToNumber(String(cell.innerText));
        });

        source.forEach((cell: any) => {
          cellData.imageUrl = cell.getAttribute('src');
        });

        _24h.forEach((cell: any) => {
          cellData.change24h = parseFloat(cell.innerText);
        });

        if (Object.keys(cellData).length == 6)
          rowData.push(cellData as CoinData);
      }

      return rowData;
    });

    console.log(tableData);
    data = data.concat(tableData);
    if (previousLength > tableData.length) break;
    previousLength = tableData.length;
    i++;

  }

  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  await browser.close();

  return data;
};
