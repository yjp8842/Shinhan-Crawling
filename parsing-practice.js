import axios from "axios";
import * as cheerio from 'cheerio';

import fs from 'fs';

async function getData() {
  const data = [];
  
  const url = 'https://quotes.toscrape.com/';
  
  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);

    await Promise.all($('.quote').map(async (i, el)=>{
      const quote = $(el).find('.text').text();
      const author = $(el).find('.author').text();
      const author_url = $(el).find('a').prop('href');
      const tagsArray = $(el).find('.tags a').map((i, tag) => 
        $(tag).text()
      ).get();

        
      async function getDetail() {
        const author_detail = [];

        const authorUrl = `https://quotes.toscrape.com/${author_url}`;

        try {
          const res = await axios(authorUrl);
          // console.log(res);
          const $ = cheerio.load(res.data);
  
          const author_born_date = $('.author-born-date').text();
          const author_born_location = $('.author-born-location').text();
          const author_description = $('.author-description').text().trim();

          author_detail['author_born_date'] = author_born_date;
          author_detail['author_born_location'] = author_born_location;
          author_detail['author_description'] = author_description;

          return author_detail;

          // console.log('author_detail: ', author_detail);
        } catch (err) {
          console.log(err);
        }
      }

      const author_detail = await getDetail();

      
      data[i] = {
        'quote': quote,
        'author': author,
        'author_url': author_url,
        'tags': tagsArray,
        'author_detail' : author_detail,
      }
    }));
    
    fs.writeFileSync('./quote.json', JSON.stringify(data));
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
}

getData();