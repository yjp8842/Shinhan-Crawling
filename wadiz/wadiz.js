import axios from "axios";
import fs from 'fs';

async function getData(url) {
  try {
    const response = await axios.post(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      },
      body: {
        startNum: 360, 
        order: "recommend", 
        limit: 48, 
        categoryCode: "", 
        endYn: ""
      }
    });

    // console.log(response.data.data.list);
    fs.writeFileSync('./wadiz.json', JSON.stringify(response.data.data.list, null, 2));
  } catch (err) {
    console.log(err);
  }
}

async function wadizCrawl() {
  const url = 'https://service.wadiz.kr/api/search/funding';
  await getData(url);
}

wadizCrawl();