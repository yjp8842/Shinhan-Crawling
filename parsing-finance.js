import axios from "axios";
import * as cheerio from 'cheerio';

import fs from 'fs';

async function fetchDailyPrice(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const tableRows = $("table.type2 tr");
    const dailyPrices = [];

    tableRows.each(function() {
      // 테이블의 각 row를 순회하면서 필요한 데이터를 추출합니다.
      let row = $(this).find('td');
      if(row.length > 0){
        let date = $(row[0]).text().trim();
        let close = $(row[1]).text().trim();
        let previous = $(row[2]).text().trim();
        let market = $(row[3]).text().trim();
        let high = $(row[4]).text().trim();
        let low = $(row[5]).text().trim();
        let volume = $(row[6]).text().trim();
        if(date) {
          dailyPrices.push({ 
            '날짜': date, 
            '종가': close,
            '전일비': previous,
            '시가': market,
            '고가': high,
            '저가': low,
            '거래량': volume 
          });
        }
      }
    });

    return dailyPrices;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function crawlFinance() {
  const code = '005930'; // 삼성전자의 종목 코드
  const url = `https://finance.naver.com/item/sise_day.nhn?code=${code}`; // 1 페이지의 URL
  const dailyPrices = await fetchDailyPrice(url);

  fs.writeFileSync('./dailyPrice.json', JSON.stringify(dailyPrices, null, 2));
  // console.log(dailyPrices);
}

crawlFinance();