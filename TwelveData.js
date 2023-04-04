require("dotenv").config();

const request = require('request')

// API key provided by twelvedata.com
let TDKEY = process.env.TwelveData_APIKEY

async function CurrentPrices(ticker) {

  return await new Promise((resolve, reject) => {

    // content provided by twelvedata
var url = 'https://api.twelvedata.com/price?symbol=' + ticker + '&apikey=' + TDKEY;


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
      resolve(data)
    }
})})};

async function getPrice(ticker){

  let stockPrice = await CurrentPrices(ticker)
  console.log(stockPrice)

  return stockPrice
}

module.exports = { getPrice }