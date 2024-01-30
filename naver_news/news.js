import axios from "axios";
import * as cheerio from 'cheerio';
import https from 'https';
import crypto from 'crypto';

import fs from 'fs';

fs.readdir('img', (err) => {
  if (err) {
    console.log('이미지 폴더가 없어서 생성합니다.');
    fs.mkdirSync('img');
  }
})

async function getData() {
  const url = 'https://search.naver.com/search.naver?where=news&sm=tab_jum&query=%EC%9D%B4%EC%B0%A8%EC%A0%84%EC%A7%80';
  const data = [];

  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);

    // 가져올 데이터 : 제목, 신문사, 요약설명, 이미지(존재시)
    await Promise.all($('.bx').find('.news_area').map(async(i, el) => {
      const title = $(el).find('.news_contents a.news_tit').text();
      const press = $(el).find('.info_group > a').text();
      const summary = $(el).find('a.dsc_txt_wrap').text();
      const imgData = $(el).find('.dsc_thumb img').prop('data-lazysrc');

      // 이미지 url을 이용해 이미지 파일로 저장
      if (imgData) {
        const imgResult = await axios.get(imgData, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          },
          responseType: 'arraybuffer'
        });

        // console.log(imgResult.data);
        
        fs.writeFileSync(`img/${i}.jpg`, imgResult.data);
      }

      const detailUrl = $(el).find('a.news_tit').prop('href');
      
      async function getDetail() {

        const detail_url = `${detailUrl}`

        try {
          const res = await axios.get(detail_url, {
            // RestError: write EPROTO 40736C4DF87F0000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled:../deps/openssl/openssl/ssl/statem/extensions.c:922: 에러가 발생했을 때 해결하는 방법
            httpsAgent: new https.Agent({
              secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            })
          });

          const article_detail = res.data;

          return article_detail;
        } catch (err) {
          // console.log(err);
        }
      }

      const article_detail = await getDetail();

      data[i] = {
        'title': title,
        'press': press,
        'summary': summary,
        'image_url': imgData,
        'details': article_detail,
      }
    }));

    fs.writeFileSync('./news.json', JSON.stringify(data, null, 2));
    
  } catch (err) {
    // console.log(err);
  }
}

getData();