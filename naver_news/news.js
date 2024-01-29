import axios from "axios";
import * as cheerio from 'cheerio';

import fs from 'fs';

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

      const detailUrl = $(el).find('a.news_tit').prop('href');
      
      async function getDetail() {
        // const agent = new https.Agent({
        //   rejectUnauthorized: false, // Only set this to true in a development environment
        //   secureProtocol: 'TLSv1_method', // Specify the TLS version (e.g., 'TLSv1_2')
        // });

        const detail_url = `${detailUrl}`

        try {
          const res = await axios.get(detail_url);
          const $ = cheerio.load(res.data);
          const article_detail = $.html();

          return article_detail;
        } catch (err) {
          // console.log(err);
        }
      }

      const article_detail = await getDetail();

      data[i] = {
        '제목': title,
        '신문사': press,
        '요약 설명': summary,
        '이미지': imgData,
        '본문': article_detail,
      }
    }));

    fs.writeFileSync('./news.json', JSON.stringify(data, null, 2));
    // console.log($('a.news_tit').text());
  } catch (err) {
    // console.log(err);
  }
}

getData();