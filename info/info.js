import axios from "axios";
import * as cheerio from 'cheerio';
import fs from 'fs';

// EUC-KR로 데아터를 디코딩하기 위한 라이브러리
import iconv from 'iconv-lite';

async function fetchInfo(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      },
      responseType: 'arraybuffer',
    });
    // 바이너리 형태로 데이터를 받고, EUC-KR로 데이터를 디코딩
    const $ = cheerio.load(iconv.decode(Buffer.from(response.data), 'EUC-KR'), {
      decodeEntities: false,
    });
    const tableRows = $("table.type6 tr");
    const infos = [];

    tableRows.each(function() {
      // 테이블의 각 row를 순회하면서 필요한 데이터를 추출합니다.
      let row = $(this).find('td');
      if(row.length > 0){
        let title = $(row[0]).find('.tit').text().trim();
        let from = $(row[1]).text().trim();
        let date = $(row[2]).text().trim();
        if (date) {
          infos.push({ 
            'title': title, 
            'from': from,
            'date': date
          });
        }
      }
    });

    return infos;

  } catch (err) {
    console.log(err);
  }
}

async function getInfo() {
  const code = '005930'; // 삼성전자의 종목 코드
  const url = `https://finance.naver.com/item/news_notice.naver?code=${code}&page=`;
  const infoList = await fetchInfo(url);
  fs.writeFileSync('./info.json', JSON.stringify(infoList, null, 2));
}

getInfo();