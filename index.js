// const axios  = require('axios');

import axios from "axios";

// axios({
//   method: 'get',
//   url: 'https://www.naver.com/',
// })
//   .then((response) => {
//     console.log(response);
//   })

async function fetchPage() {
  const url = 'https://www.naver.com';

  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch(err) {
    console.log(err);
  }

}

fetchPage();