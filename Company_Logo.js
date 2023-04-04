
var request = require('request');

let TDKEY = "b3b72e5d9b7e45b2a0d740319d2eed18"


async function fetchLogo(ticker) {

    return await new Promise((resolve, reject) => {

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url = 'https://api.twelvedata.com/logo?symbol=' + ticker + '&apikey=' + TDKEY;

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      //console.log(data);
      resolve(data);
    }
})})};

async function showLogo(ticker){

    let logo = await fetchLogo(ticker)
    //console.log(logo)
  
    return logo.url
  }



module.exports = { showLogo }