import * as cheerio from 'cheerio';

const data = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root">
      <div class="content">
        <ul class="profile">
          <li class="other">서희</li>
          <li class="me">
            <a href="/profile/me">유진</a>  
          </li>
          <li class="other">예린</li>
        </ul>
      </div>
    </div>
  </body>
  </html>
`;

const $ = cheerio.load(data);
// console.log($.html());
// console.log($('.other').text());
const items = $('a').map((i, el) => {
  return {
    url: $(el).prop('href'),
    text: $(el).text()
  }
}).get()
console.log(items);