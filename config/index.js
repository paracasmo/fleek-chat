var fs = require('fs');
var config = {
  twitter: {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: ''
  },
  port: 3000,
  tweetDelay: 2000,
  languages: ['en', 'de'],
  filters: initFilters()
}

function initFilters() {
  const filterListPath = './config/filterlist.txt';
  try {
    fs.access(filterListPath, fs.constants.F_OK);
    return fs.readFileSync(filterListPath, 'utf8').split('\r\n');
  } catch (err) {
    return ["RT ", "http:", "https:"];
  }
}

module.exports = config;