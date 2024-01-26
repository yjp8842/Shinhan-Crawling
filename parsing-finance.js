import axios from "axios";
import * as cheerio from 'cheerio';

async function getData() {
  const url = 'https://finance.naver.com/item/sise_day.naver?code=005930&page=1';
  const data = [];

  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);

    // console.log($('strong').text())
    console.log($.html())
    
  } catch (err) {
    console.log(err);
  }
}

getData();